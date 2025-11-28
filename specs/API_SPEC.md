# Consumer API Specification

This document outlines the API endpoints for the Consumer API service.

## Base URL

(Assuming the service is running locally or on a specific host. Please update with the correct base URL.)

## Authentication

### Sign In

Authenticate a user and receive access tokens.

- **URL**: `/auth/signin`
- **Method**: `POST`
- **Description**: Sign in using username and password.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | string | Yes | The user's username |
| `password` | string | Yes | The user's password |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Sign Up

Register a new user.

- **URL**: `/auth/signup`
- **Method**: `POST`
- **Description**: Sign up using username and password.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address |
| `username` | string | No | User's username |
| `password` | string | No | User's password |
| `phone_number` | string | No | User's phone number |
| `full_address` | string | No | Full address string |
| `address1` | string | No | Address line 1 |
| `address2` | string | No | Address line 2 |
| `city` | string | No | City |
| `county` | string | No | County |
| `state` | string | No | State |
| `zip` | string | No | Zip code |
| `first_name` | string | No | First name |
| `middle_name` | string | No | Middle name |
| `last_name` | string | No | Last name |
| `locale` | string | No | User locale |
| `timezone` | string | No | User timezone |
| `inverter_api_key` | string | No | Inverter API Key |
| `inverter_api_secret` | string | No | Inverter API Secret |
| `inverter_inverter_id` | string | No | Inverter ID |
| `inverter_inverter_type` | string | No | Inverter Type |
| `inverter_monitoring_api_url` | string | No | Monitoring API URL |
| `inverter_monitoring_id` | string | No | Monitoring ID |
| `inverter_monitoring_token` | string | No | Monitoring Token |
| `inverter_manufacturer` | string | No | Inverter Manufacturer |
| `inverter_serial_number` | string | No | Inverter Serial Number |
| `site_id` | string | No | Site ID |
| `site_type` | string | No | Site Type |
| `installation_date` | string | No | Installation Date |
| `installer_id` | string | No | Installer ID |
| `installer_name` | string | No | Installer Name |
| `installer_email` | string | No | Installer Email |
| `installer_phone` | string | No | Installer Phone |
| `installer_address` | string | No | Installer Address |
| `installer_city` | string | No | Installer City |
| `installer_state` | string | No | Installer State |
| `installer_zip` | string | No | Installer Zip |
| `info` | string | No | Additional info |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Confirm Email

Confirm a user's email address using a confirmation code.

- **URL**: `/auth/confirm-email`
- **Method**: `POST`
- **Description**: Confirm a user's email address.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address |
| `code` | string | Yes | Confirmation code |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Resend Email Confirmation Code

Resend the email confirmation code.

- **URL**: `/auth/resend-email-confirmation-code`
- **Method**: `POST`
- **Description**: Resend a confirmation code to a user's email address.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | Yes | User's email address |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Refresh Token

Get a new access token using a refresh token.

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Description**: Refresh access token using refresh token.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `refresh_token` | string | Yes | The refresh token |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Delete User

Delete a user from the system (Cognito user pool).

- **URL**: `/auth/delete-user`
- **Method**: `POST`
- **Description**: Delete a user from the Cognito user pool.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `access_token` | string | Yes | The access token |
| `email` | string | No | User's email |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Update Profile

Update user profile information.

- **URL**: `/auth/update-profile`
- **Method**: `POST`
- **Description**: Update user profile in the Cognito user pool.

#### Request Body

**Content-Type**: `application/json`

(Includes fields similar to Sign Up, plus `account_id`)

| Field | Type | Required | Description |
|---|---|---|---|
| `account_id` | string | Yes | Account ID |
| `email` | string | No | Email |
| `username` | string | No | Username |
| `password` | string | No | Password |
| `phone_number` | string | No | Phone number |
| `full_address` | string | No | Full address string |
| `address1` | string | No | Address line 1 |
| `address2` | string | No | Address line 2 |
| `city` | string | No | City |
| `county` | string | No | County |
| `state` | string | No | State |
| `zip` | string | No | Zip code |
| `first_name` | string | No | First name |
| `middle_name` | string | No | Middle name |
| `last_name` | string | No | Last name |
| `locale` | string | No | User locale |
| `timezone` | string | No | User timezone |
| `inverter_api_key` | string | No | Inverter API Key |
| `inverter_api_secret` | string | No | Inverter API Secret |
| `inverter_inverter_id` | string | No | Inverter ID |
| `inverter_inverter_type` | string | No | Inverter Type |
| `inverter_monitoring_api_url` | string | No | Monitoring API URL |
| `inverter_monitoring_id` | string | No | Monitoring ID |
| `inverter_monitoring_token` | string | No | Monitoring Token |
| `inverter_manufacturer` | string | No | Inverter Manufacturer |
| `inverter_serial_number` | string | No | Inverter Serial Number |
| `site_id` | string | No | Site ID |
| `site_type` | string | No | Site Type |
| `installation_date` | string | No | Installation Date |
| `installer_id` | string | No | Installer ID |
| `installer_name` | string | No | Installer Name |
| `installer_email` | string | No | Installer Email |
| `installer_phone` | string | No | Installer Phone |
| `installer_address` | string | No | Installer Address |
| `installer_city` | string | No | Installer City |
| `installer_state` | string | No | Installer State |
| `installer_zip` | string | No | Installer Zip |
| `info` | string | No | Additional info |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

## Admin

### Register Inverter

Register a new inverter.

- **URL**: `/admin/register-inverter`
- **Method**: `POST`
- **Description**: Register an inverter in the consumer database.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `inverter_id` | string | Yes | Inverter ID |
| `inverter_type` | string | Yes | Inverter Type |
| `entity_type` | string | No | Default: "inverter" |
| `inverter_monitoring_id` | string | No | Monitoring ID |
| `inverter_monitoring_token` | string | No | Monitoring Token |
| `inverter_monitoring_url` | string | No | Monitoring URL |
| `inverter_monitoring_api_key` | string | No | Monitoring API Key |
| `inverter_monitoring_api_secret` | string | No | Monitoring API Secret |
| `inverter_monitoring_api_url` | string | No | Monitoring API URL |
| `inverter_monitoring_api_version` | string | No | Monitoring API Version |
| `inverter_manufacturer` | string | No | Manufacturer |
| `inverter_serial_number` | string | No | Serial Number |
| `info` | string | No | Additional info |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Register Site Inverter

Register a site and inverter together.

- **URL**: `/admin/register-site-inverter`
- **Method**: `POST`
- **Description**: Register a site and inverter in the consumer database.

#### Request Body

**Content-Type**: `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `inverter_id` | string | Yes | Inverter ID |
| `inverter_type` | string | Yes | Inverter Type |
| `site_id` | string | No | Site ID |
| `site_type` | string | No | Site Type |
| `entity_type` | string | No | Default: "inverter" |
| `inverter_monitoring_id` | string | No | Monitoring ID |
| `inverter_monitoring_token` | string | No | Monitoring Token |
| `inverter_monitoring_url` | string | No | Monitoring URL |
| `inverter_monitoring_api_key` | string | No | Monitoring API Key |
| `inverter_monitoring_api_secret` | string | No | Monitoring API Secret |
| `inverter_monitoring_api_url` | string | No | Monitoring API URL |
| `inverter_monitoring_api_version` | string | No | Monitoring API Version |
| `inverter_manufacturer` | string | No | Manufacturer |
| `inverter_serial_number` | string | No | Serial Number |
| `info` | string | No | Additional info |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

---

### Upload Utility Bills

Upload utility bill files.

- **URL**: `/admin/upload-utility-bills`
- **Method**: `POST`
- **Description**: Upload utility bills (PDF, PNG, JPEG) to S3 bucket. Files are organized by account_id.

#### Request Body

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `account_id` | string | Yes | Account ID |
| `files` | array[file] | Yes | List of files to upload |

#### Responses

- **200 OK**: Successful Response
- **422 Validation Error**: Invalid input data

## Consumer

### Consumer Result Endpoint

Get consumer metrics and data.

- **URL**: `/`
- **Method**: `GET`
- **Description**: Main endpoint to retrieve consumer results including account info, metrics, economics, and optimization data.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `account_id` | string | Yes | - | The Account ID to get the result for |
| `services` | array[string] | Yes | - | List of services to retrieve (e.g., metrics, economics) |
| `start_date` | string | No | - | Start date for data retrieval |
| `start_hour` | integer | No | 0 | Start hour |
| `end_date` | string | No | - | End date for data retrieval |
| `end_hour` | integer | No | 23 | End hour |
| `metrics_type` | string | No | - | Type of metrics (e.g., TODAY, DAILY, MONTHLY) |
| `optimization_mode` | string | No | - | Optimization mode (e.g., AI_ASSISTANT, STORM_MODE) |
| `timezone` | string | No | - | Timezone for the result |

#### Responses

- **200 OK**: Successful Response. Returns a `ConsumerResult` object.
- **422 Validation Error**: Invalid input data

#### Response Schema: ConsumerResult

The response contains wrappers for different data sections requested via the `services` parameter.

```json
{
  "get_optimization_metrics": {
    "data": [ ... ],
    "message": "string",
    "status": "success"
  },
  "get_account": {
    "data": [ ... ],
    "message": "string",
    "status": "success"
  },
  "get_metrics": {
    "data": [ ... ],
    "message": "string",
    "status": "success"
  },
  "get_economics": {
    "data": [ ... ],
    "message": "string",
    "status": "success"
  }
}
```

**Data Models:**

- **MetricsResponse**: Contains power metrics like `battery_soc`, `total_sell_to_grid`, `total_buy_from_grid`, `total_pv_production`, `total_consumption`.
- **EconomicsResponse**: Contains financial metrics like `current_month_bill_without_system`, `current_month_earning_by_optimization`, `history_peak_months_bill`.
- **OptimizationMetricsResponse**: Contains optimization run details like `buy_price`, `sell_price`, `battery_action`, `grid_action`.
- **AccountResponse**: Contains user account details.

