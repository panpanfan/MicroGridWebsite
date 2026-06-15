# go.microvpp.com — short registration redirect

Makes the QR/registration URL short and on its own subdomain:

```
https://go.microvpp.com/?sn=2517-65170160PH        (QR encodes this)
        │  301 (CloudFront Function, query string preserved)
        ▼
https://www.microvpp.com/lin.html?sn=2517-65170160PH   (real page, unchanged)
```

`www.microvpp.com` stays on GitHub Pages and `lin.html` is **not** modified.
`go.microvpp.com` is a pure HTTPS redirect served by AWS CloudFront. DNS lives
in **Microsoft 365** (which can't do URL forwarding itself, hence CloudFront).

## Files

- `redirect.js` — CloudFront Function (viewer-request) that issues the 301.
- `deploy.sh`  — idempotent/resumable provisioning script (AWS CLI + jq).

## Prerequisites

- AWS CLI v2, configured with credentials that can manage ACM + CloudFront.
- `jq` installed.
- Run in bash (WSL Ubuntu is fine): `bash deploy.sh`

## Background: the CAA gotcha (why the order matters)

`go.microvpp.com` was already a `CNAME` to `cname.short.io` (Short.io). ACM cert
issuance fails with a **CAA error** while that's in place, because
`cname.short.io`'s CAA only authorizes Sectigo/Let's Encrypt, not Amazon.

The Microsoft 365 simplified DNS panel for this tenant only allows **Add/Edit**,
**not Delete**, of custom records. So instead of deleting the `go` record, we
**edit (repoint)** it to the CloudFront domain — which is the final desired
state anyway. `cloudfront.net` has only `issuewild` CAA (no plain `issue`), so
Amazon issuance for `go.microvpp.com` is permitted once it points there.

> Do NOT repoint `go` to `www.microvpp.com` / `panpanfan.github.io` — their CAA
> only allows Let's Encrypt/DigiCert/Sectigo and would re-trigger the failure.

## Step-by-step

1. **First run** — creates the function and a CloudFront distribution *without*
   a custom domain yet (served on its default `*.cloudfront.net` name), then
   prints that domain and the next instructions:

   ```bash
   bash deploy.sh
   ```

2. **Edit (repoint) the `go` CNAME in Microsoft 365**
   (admin.microsoft.com → Settings → Domains → `microvpp.com` → DNS records →
   click the `go` record → edit). Change **Points to address**:
   `cname.short.io` → `dXXXXXXXX.cloudfront.net` (the value step 1 printed).
   Also disconnect `go.microvpp.com` in the Short.io dashboard.

3. **Request the ACM cert** (the `_…go.microvpp.com` validation CNAME is already
   in DNS and gets reused; delete the old *failed* cert to avoid confusion):

   ```bash
   aws acm request-certificate --region us-east-1 \
     --domain-name go.microvpp.com --validation-method DNS
   ```

   With `go` no longer chained to Short.io, the CAA check passes and the cert
   moves to **Issued** within a few minutes.

4. **Re-run** once ACM shows `ISSUED`. This attaches the custom domain
   (`go.microvpp.com`) + cert to the existing distribution:

   ```bash
   bash deploy.sh
   ```

   Leave existing `MX`, `autodiscover`, SPF/`TXT`, and DKIM records alone —
   those run Microsoft 365 email.

5. **Test** (after the distribution finishes redeploying, ~5–15 min):

   ```bash
   curl -sI "https://go.microvpp.com/?sn=2517-65170160PH"
   # HTTP/2 301
   # location: https://www.microvpp.com/lin.html?sn=2517-65170160PH
   ```

6. **Regenerate the QR codes** to encode `https://go.microvpp.com/?sn=<serial>`
   (optionally `&state=texas`).

## Updating the redirect later

Edit `redirect.js` and re-run `bash deploy.sh`. The script updates and
republishes the function in place (no distribution change needed).

## Cost

A redirect-only distribution with `PriceClass_100` and CloudFront Functions is
effectively pennies/month at low traffic (no origin fetches, tiny responses).
