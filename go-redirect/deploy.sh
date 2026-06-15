#!/usr/bin/env bash
#
# Provision go.microvpp.com as an HTTPS 301 redirect to
# https://www.microvpp.com/lin.html (preserving the query string) using
# AWS CloudFront + a CloudFront Function + an ACM certificate.
#
# This variant needs NO ability to DELETE DNS records (the Microsoft 365
# simplified DNS panel only lets you Add/Edit). It works in phases:
#
#   Phase 1 (no usable cert yet):
#     - creates/updates+publishes the redirect CloudFront Function
#     - creates the CloudFront distribution WITHOUT a custom domain/cert
#       (served on its default *.cloudfront.net name)
#     - prints the dXXXX.cloudfront.net domain so you can EDIT (repoint) the
#       existing  go  CNAME  from  cname.short.io  ->  dXXXX.cloudfront.net
#     - prints the exact ACM request command to run AFTER repointing
#
#   Phase 2 (after the cert is ISSUED): re-run this script. It attaches the
#     custom domain (go.microvpp.com) + ACM cert to the existing distribution.
#
# Requirements: aws CLI v2 (configured) + jq.  Run in bash (e.g. WSL Ubuntu).
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SUBDOMAIN="go.microvpp.com"
REDIRECT_TARGET_HOST="www.microvpp.com"          # also used as the (unused) origin
FUNCTION_NAME="microvpp-go-redirect"
ACM_REGION="us-east-1"                            # MUST be us-east-1 for CloudFront
PRICE_CLASS="PriceClass_100"                      # cheapest (NA + EU edges)
CACHE_POLICY_CACHING_DISABLED="4135ea2d-6df8-44a3-9df3-4b5a84be39ad"  # AWS-managed "CachingDisabled"
DIST_COMMENT="Redirect ${SUBDOMAIN} -> ${REDIRECT_TARGET_HOST}/lin.html"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUNCTION_FILE="${SCRIPT_DIR}/redirect.js"

command -v aws >/dev/null || { echo "ERROR: aws CLI not found."; exit 1; }
command -v jq  >/dev/null || { echo "ERROR: jq not found."; exit 1; }
[[ -f "$FUNCTION_FILE" ]] || { echo "ERROR: $FUNCTION_FILE missing."; exit 1; }

# ---------------------------------------------------------------------------
# 1. CloudFront Function (create or update) + publish
# ---------------------------------------------------------------------------
echo "==> [1/3] Ensuring CloudFront Function '${FUNCTION_NAME}'..."
if aws cloudfront describe-function --name "$FUNCTION_NAME" >/dev/null 2>&1; then
  ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query ETag --output text)
  aws cloudfront update-function --name "$FUNCTION_NAME" --if-match "$ETAG" \
    --function-config "Comment=redirect ${SUBDOMAIN} to ${REDIRECT_TARGET_HOST}/lin.html,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://${FUNCTION_FILE}" >/dev/null
  ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query ETag --output text)
  echo "    Updated existing function."
else
  CREATE=$(aws cloudfront create-function --name "$FUNCTION_NAME" \
    --function-config "Comment=redirect ${SUBDOMAIN} to ${REDIRECT_TARGET_HOST}/lin.html,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://${FUNCTION_FILE}")
  ETAG=$(echo "$CREATE" | jq -r .ETag)
  echo "    Created function."
fi
aws cloudfront publish-function --name "$FUNCTION_NAME" --if-match "$ETAG" >/dev/null
FUNCTION_ARN=$(aws cloudfront describe-function --name "$FUNCTION_NAME" \
  --query FunctionSummary.FunctionMetadata.FunctionARN --output text)
echo "    Published: $FUNCTION_ARN"

# ---------------------------------------------------------------------------
# 2. Distribution (create without a custom domain if it doesn't exist yet)
# ---------------------------------------------------------------------------
echo "==> [2/3] Ensuring CloudFront distribution (matched by comment)..."
DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='${DIST_COMMENT}'].Id | [0]" \
  --output text 2>/dev/null || echo "None")

if [[ "$DIST_ID" == "None" || -z "$DIST_ID" ]]; then
  echo "    Creating distribution (no custom domain yet, default *.cloudfront.net cert)..."
  CALLER_REF="microvpp-go-$(date +%s)"
  CONFIG_FILE="$(mktemp)"
  cat > "$CONFIG_FILE" <<JSON
{
  "CallerReference": "${CALLER_REF}",
  "Aliases": { "Quantity": 0 },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "redirect-origin",
        "DomainName": "${REDIRECT_TARGET_HOST}",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only",
          "OriginSslProtocols": { "Quantity": 1, "Items": ["TLSv1.2"] },
          "OriginReadTimeout": 30,
          "OriginKeepaliveTimeout": 5
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "redirect-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] }
    },
    "Compress": true,
    "CachePolicyId": "${CACHE_POLICY_CACHING_DISABLED}",
    "FunctionAssociations": {
      "Quantity": 1,
      "Items": [ { "EventType": "viewer-request", "FunctionARN": "${FUNCTION_ARN}" } ]
    }
  },
  "Comment": "${DIST_COMMENT}",
  "Enabled": true,
  "ViewerCertificate": { "CloudFrontDefaultCertificate": true },
  "HttpVersion": "http2and3",
  "PriceClass": "${PRICE_CLASS}"
}
JSON
  RESULT=$(aws cloudfront create-distribution --distribution-config "file://${CONFIG_FILE}")
  rm -f "$CONFIG_FILE"
  DIST_ID=$(echo "$RESULT" | jq -r .Distribution.Id)
fi
DIST_DOMAIN=$(aws cloudfront get-distribution --id "$DIST_ID" --query Distribution.DomainName --output text)
echo "    Distribution: ${DIST_ID} (${DIST_DOMAIN})"

# ---------------------------------------------------------------------------
# 3. Attach the custom domain + ACM cert once the cert is ISSUED
# ---------------------------------------------------------------------------
echo "==> [3/3] Checking for an ISSUED ACM cert for ${SUBDOMAIN} (${ACM_REGION})..."
CERT_ARN=$(aws acm list-certificates --region "$ACM_REGION" \
  --certificate-statuses ISSUED \
  --query "CertificateSummaryList[?DomainName=='${SUBDOMAIN}'].CertificateArn | [0]" \
  --output text)

ALREADY_ALIASED=$(aws cloudfront get-distribution-config --id "$DIST_ID" \
  --query "DistributionConfig.Aliases.Items" --output text 2>/dev/null || echo "")

if [[ -n "$CERT_ARN" && "$CERT_ARN" != "None" ]]; then
  if echo "$ALREADY_ALIASED" | grep -qw "$SUBDOMAIN"; then
    echo "    Custom domain already attached. Nothing to do."
  else
    echo "    Cert ISSUED ($CERT_ARN). Attaching ${SUBDOMAIN} + cert to the distribution..."
    TMP="$(mktemp -d)"
    aws cloudfront get-distribution-config --id "$DIST_ID" > "${TMP}/full.json"
    DIST_ETAG=$(jq -r .ETag "${TMP}/full.json")
    jq --arg sub "$SUBDOMAIN" --arg cert "$CERT_ARN" '.DistributionConfig
        | .Aliases = {Quantity: 1, Items: [$sub]}
        | .ViewerCertificate = {CertificateSource: "acm", ACMCertificateArn: $cert, SSLSupportMethod: "sni-only", MinimumProtocolVersion: "TLSv1.2_2021"}' \
        "${TMP}/full.json" > "${TMP}/config.json"
    aws cloudfront update-distribution --id "$DIST_ID" --if-match "$DIST_ETAG" \
      --distribution-config "file://${TMP}/config.json" >/dev/null
    rm -rf "$TMP"
    echo "    Attached."
  fi
  echo ""
  echo "==> DONE. Make sure the 'go' CNAME points at the distribution:"
  echo "      Host: go    Value: ${DIST_DOMAIN}    (CNAME, TTL 1 hour)"
  echo "    Then test (allow a few min for the distribution to redeploy):"
  echo "      curl -sI \"https://${SUBDOMAIN}/?sn=2517-65170160PH\""
  echo "      -> 301  location: https://www.microvpp.com/lin.html?sn=2517-65170160PH"
else
  cat <<NEXT

==> No ISSUED cert yet. Do these, in order, then re-run this script:

  1) EDIT the existing 'go' CNAME in the Microsoft 365 admin center
     (you can't delete it, but you can edit it). Change "Points to address":
         from:  cname.short.io
         to:    ${DIST_DOMAIN}
     (Do NOT point it at www.microvpp.com / github.io -- their CAA blocks
      Amazon and the cert will fail again. ${DIST_DOMAIN} is safe.)

  2) Wait for that change to propagate (mind the 1/2-hour TTL), then confirm:
         nslookup ${SUBDOMAIN} 8.8.8.8        # should show ${DIST_DOMAIN}

  3) Request the ACM certificate (the _...go.microvpp.com validation CNAME is
     already in your DNS and will be reused):
         aws acm request-certificate --region ${ACM_REGION} \\
           --domain-name ${SUBDOMAIN} --validation-method DNS

  4) When ACM shows ISSUED (a few minutes), re-run:  bash deploy.sh
NEXT
fi
