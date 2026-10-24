# Stripe 集成待办

## Values to Replace

**Files containing placeholders:**
- [checkout.html](checkout.html)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| STRIPE_PK | pk_test_... | 你的 Stripe Publishable Key（https://dashboard.stripe.com/test/apikeys） |

## Configured Parameters

**Files containing these parameters:**
- Worker `/api/create-checkout-session`（待部署）

| Parameter | Value |
|-----------|-------|
| ui_mode | form |
| billing_address_collection | auto |
| phone_number_collection | enabled: false |
| automatic_tax | enabled: false |
| payment_method_collection | always |
| submit_type | auto |
| saved_payment_method_options | payment_method_save: enabled |
| integration_identifier | custom_embedded_web_0001 |

## Setup and Next Steps

### 1. 环境变量（Worker 配置）
- `STRIPE_SECRET_KEY`：`sk_test_...`
- `STRIPE_WEBHOOK_SECRET`：`whsec_...`
- `STRIPE_PRICE_PRO`：Club One Pro 价格 ID（`price_...`）
- `STRIPE_PRICE_ONE`：Club One 价格 ID（`price_...`）
- `STRIPE_PRICE_BOOK_PREFIX`：词书价格前缀

### 2. Worker 端点
- `POST /api/create-checkout-session`：创建 Checkout Session，返回 `client_secret`
- `POST /api/webhook`：处理支付成功回调，自动加积分

### 3. 测试支付
- 测试卡号：`4242 4242 4242 4242`
- 任意未来日期 + 任意 CVC
- 沙盒模式不扣真钱

### 4. 下一步
- 填入真实 Publishable Key
- 部署 Worker
- 配置 Webhook
- 测试完整流程
- 切真实模式前验证账户
