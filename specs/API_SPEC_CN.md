# 消费者 API 规范 (Consumer API Specification)

本文档概述了消费者 API 服务的 API 端点。

## 基础 URL (Base URL)

(假设服务在本地或特定主机上运行。请更新为正确的基础 URL。)

## 认证 (Authentication)

### 登录 (Sign In)

验证用户身份并接收访问令牌。

- **URL**: `/auth/signin`
- **方法**: `POST`
- **描述**: 使用用户名和密码登录。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `username` | string | 是 | 用户的用户名 |
| `password` | string | 是 | 用户的密码 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 注册 (Sign Up)

注册新用户。

- **URL**: `/auth/signup`
- **方法**: `POST`
- **描述**: 使用用户名和密码注册。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `email` | string | 是 | 用户的电子邮件地址 |
| `username` | string | 否 | 用户的用户名 |
| `password` | string | 否 | 用户的密码 |
| `phone_number` | string | 否 | 用户的电话号码 |
| `full_address` | string | 否 | 完整地址字符串 |
| `address1` | string | 否 | 地址行 1 |
| `address2` | string | 否 | 地址行 2 |
| `city` | string | 否 | 城市 |
| `county` | string | 否 | 县/郡 |
| `state` | string | 否 | 州/省 |
| `zip` | string | 否 | 邮政编码 |
| `first_name` | string | 否 | 名 |
| `middle_name` | string | 否 | 中间名 |
| `last_name` | string | 否 | 姓 |
| `locale` | string | 否 | 用户区域设置 |
| `timezone` | string | 否 | 用户时区 |
| `inverter_api_key` | string | 否 | 逆变器 API 密钥 |
| `inverter_api_secret` | string | 否 | 逆变器 API 密钥 (Secret) |
| `inverter_inverter_id` | string | 否 | 逆变器 ID |
| `inverter_inverter_type` | string | 否 | 逆变器类型 |
| `inverter_monitoring_api_url` | string | 否 | 监控 API URL |
| `inverter_monitoring_id` | string | 否 | 监控 ID |
| `inverter_monitoring_token` | string | 否 | 监控令牌 |
| `inverter_manufacturer` | string | 否 | 逆变器制造商 |
| `inverter_serial_number` | string | 否 | 逆变器序列号 |
| `site_id` | string | 否 | 站点 ID |
| `site_type` | string | 否 | 站点类型 |
| `installation_date` | string | 否 | 安装日期 |
| `installer_id` | string | 否 | 安装商 ID |
| `installer_name` | string | 否 | 安装商名称 |
| `installer_email` | string | 否 | 安装商电子邮件 |
| `installer_phone` | string | 否 | 安装商电话 |
| `installer_address` | string | 否 | 安装商地址 |
| `installer_city` | string | 否 | 安装商城市 |
| `installer_state` | string | 否 | 安装商州/省 |
| `installer_zip` | string | 否 | 安装商邮政编码 |
| `info` | string | 否 | 其他信息 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 确认电子邮件 (Confirm Email)

使用确认码确认用户的电子邮件地址。

- **URL**: `/auth/confirm-email`
- **方法**: `POST`
- **描述**: 确认用户的电子邮件地址。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `email` | string | 是 | 用户的电子邮件地址 |
| `code` | string | 是 | 确认码 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 重发电子邮件确认码 (Resend Email Confirmation Code)

重新发送电子邮件确认码。

- **URL**: `/auth/resend-email-confirmation-code`
- **方法**: `POST`
- **描述**: 向用户的电子邮件地址重新发送确认码。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `email` | string | 是 | 用户的电子邮件地址 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 刷新令牌 (Refresh Token)

使用刷新令牌获取新的访问令牌。

- **URL**: `/auth/refresh-token`
- **方法**: `POST`
- **描述**: 使用刷新令牌刷新访问令牌。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `refresh_token` | string | 是 | 刷新令牌 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 删除用户 (Delete User)

从系统（Cognito 用户池）中删除用户。

- **URL**: `/auth/delete-user`
- **方法**: `POST`
- **描述**: 从 Cognito 用户池中删除用户。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `access_token` | string | 是 | 访问令牌 |
| `email` | string | 否 | 用户的电子邮件 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 更新个人资料 (Update Profile)

更新用户个人资料信息。

- **URL**: `/auth/update-profile`
- **方法**: `POST`
- **描述**: 更新 Cognito 用户池中的用户个人资料。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

(包含与注册类似的字段，加上 `account_id`)

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `account_id` | string | 是 | 帐户 ID |
| `email` | string | 否 | 电子邮件 |
| `username` | string | 否 | 用户名 |
| `password` | string | 否 | 密码 |
| `phone_number` | string | 否 | 电话号码 |
| `full_address` | string | 否 | 完整地址字符串 |
| `address1` | string | 否 | 地址行 1 |
| `address2` | string | 否 | 地址行 2 |
| `city` | string | 否 | 城市 |
| `county` | string | 否 | 县/郡 |
| `state` | string | 否 | 州/省 |
| `zip` | string | 否 | 邮政编码 |
| `first_name` | string | 否 | 名 |
| `middle_name` | string | 否 | 中间名 |
| `last_name` | string | 否 | 姓 |
| `locale` | string | 否 | 用户区域设置 |
| `timezone` | string | 否 | 用户时区 |
| `inverter_api_key` | string | 否 | 逆变器 API 密钥 |
| `inverter_api_secret` | string | 否 | 逆变器 API 密钥 (Secret) |
| `inverter_inverter_id` | string | 否 | 逆变器 ID |
| `inverter_inverter_type` | string | 否 | 逆变器类型 |
| `inverter_monitoring_api_url` | string | 否 | 监控 API URL |
| `inverter_monitoring_id` | string | 否 | 监控 ID |
| `inverter_monitoring_token` | string | 否 | 监控令牌 |
| `inverter_manufacturer` | string | 否 | 逆变器制造商 |
| `inverter_serial_number` | string | 否 | 逆变器序列号 |
| `site_id` | string | 否 | 站点 ID |
| `site_type` | string | 否 | 站点类型 |
| `installation_date` | string | 否 | 安装日期 |
| `installer_id` | string | 否 | 安装商 ID |
| `installer_name` | string | 否 | 安装商名称 |
| `installer_email` | string | 否 | 安装商电子邮件 |
| `installer_phone` | string | 否 | 安装商电话 |
| `installer_address` | string | 否 | 安装商地址 |
| `installer_city` | string | 否 | 安装商城市 |
| `installer_state` | string | 否 | 安装商州/省 |
| `installer_zip` | string | 否 | 安装商邮政编码 |
| `info` | string | 否 | 其他信息 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

## 管理员 (Admin)

### 注册逆变器 (Register Inverter)

注册新的逆变器。

- **URL**: `/admin/register-inverter`
- **方法**: `POST`
- **描述**: 在消费者数据库中注册逆变器。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `inverter_id` | string | 是 | 逆变器 ID |
| `inverter_type` | string | 是 | 逆变器类型 |
| `entity_type` | string | 否 | 默认值: "inverter" |
| `inverter_monitoring_id` | string | 否 | 监控 ID |
| `inverter_monitoring_token` | string | 否 | 监控令牌 |
| `inverter_monitoring_url` | string | 否 | 监控 URL |
| `inverter_monitoring_api_key` | string | 否 | 监控 API 密钥 |
| `inverter_monitoring_api_secret` | string | 否 | 监控 API 密钥 (Secret) |
| `inverter_monitoring_api_url` | string | 否 | 监控 API URL |
| `inverter_monitoring_api_version` | string | 否 | 监控 API 版本 |
| `inverter_manufacturer` | string | 否 | 制造商 |
| `inverter_serial_number` | string | 否 | 序列号 |
| `info` | string | 否 | 其他信息 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 注册站点逆变器 (Register Site Inverter)

同时注册站点和逆变器。

- **URL**: `/admin/register-site-inverter`
- **方法**: `POST`
- **描述**: 在消费者数据库中注册站点和逆变器。

#### 请求体 (Request Body)

**Content-Type**: `application/json`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `inverter_id` | string | 是 | 逆变器 ID |
| `inverter_type` | string | 是 | 逆变器类型 |
| `site_id` | string | 否 | 站点 ID |
| `site_type` | string | 否 | 站点类型 |
| `entity_type` | string | 否 | 默认值: "inverter" |
| `inverter_monitoring_id` | string | 否 | 监控 ID |
| `inverter_monitoring_token` | string | 否 | 监控令牌 |
| `inverter_monitoring_url` | string | 否 | 监控 URL |
| `inverter_monitoring_api_key` | string | 否 | 监控 API 密钥 |
| `inverter_monitoring_api_secret` | string | 否 | 监控 API 密钥 (Secret) |
| `inverter_monitoring_api_url` | string | 否 | 监控 API URL |
| `inverter_monitoring_api_version` | string | 否 | 监控 API 版本 |
| `inverter_manufacturer` | string | 否 | 制造商 |
| `inverter_serial_number` | string | 否 | 序列号 |
| `info` | string | 否 | 其他信息 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

---

### 上传公用事业账单 (Upload Utility Bills)

上传公用事业账单文件。

- **URL**: `/admin/upload-utility-bills`
- **方法**: `POST`
- **描述**: 上传公用事业账单（PDF, PNG, JPEG）到 S3 存储桶。文件在 S3 存储桶中按 account_id 组织。

#### 请求体 (Request Body)

**Content-Type**: `multipart/form-data`

| 字段 (Field) | 类型 (Type) | 必填 (Required) | 描述 (Description) |
|---|---|---|---|
| `account_id` | string | 是 | 帐户 ID |
| `files` | array[file] | 是 | 要上传的文件列表 |

#### 响应 (Responses)

- **200 OK**: 成功响应
- **422 Validation Error**: 输入数据无效

## 消费者 (Consumer)

### 消费者结果端点 (Consumer Result Endpoint)

获取消费者指标和数据。

- **URL**: `/`
- **方法**: `GET`
- **描述**: 获取消费者结果的主要端点，包括帐户信息、指标、经济和优化数据。

#### 查询参数 (Query Parameters)

| 参数 (Parameter) | 类型 (Type) | 必填 (Required) | 默认值 (Default) | 描述 (Description) |
|---|---|---|---|---|
| `account_id` | string | 是 | - | 要获取结果的帐户 ID |
| `services` | array[string] | 是 | - | 要检索的服务列表（例如，metrics, economics） |
| `start_date` | string | 否 | - | 数据检索的开始日期 |
| `start_hour` | integer | 否 | 0 | 开始小时 |
| `end_date` | string | 否 | - | 数据检索的结束日期 |
| `end_hour` | integer | 否 | 23 | 结束小时 |
| `metrics_type` | string | 否 | - | 指标类型（例如，TODAY, DAILY, MONTHLY） |
| `optimization_mode` | string | 否 | - | 优化模式（例如，AI_ASSISTANT, STORM_MODE） |
| `timezone` | string | 否 | - | 结果的时区 |

#### 响应 (Responses)

- **200 OK**: 成功响应。返回 `ConsumerResult` 对象。
- **422 Validation Error**: 输入数据无效

#### 响应模式: ConsumerResult (Response Schema: ConsumerResult)

响应包含通过 `services` 参数请求的不同数据部分的包装器。

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

**数据模型 (Data Models):**

- **MetricsResponse**: 包含电力指标，如 `battery_soc` (电池荷电状态), `total_sell_to_grid` (售电总量), `total_buy_from_grid` (购电总量), `total_pv_production` (光伏发电总量), `total_consumption` (总消耗量)。
- **EconomicsResponse**: 包含财务指标，如 `current_month_bill_without_system` (无系统当月账单), `current_month_earning_by_optimization` (优化收益), `history_peak_months_bill` (历史高峰月账单)。
- **OptimizationMetricsResponse**: 包含优化运行详情，如 `buy_price` (买入价格), `sell_price` (卖出价格), `battery_action` (电池动作), `grid_action` (电网动作)。
- **AccountResponse**: 包含用户帐户详细信息。

