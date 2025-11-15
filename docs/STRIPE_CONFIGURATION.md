# Stripe Payment Configuration Guide

This guide covers the complete configuration of Stripe payments for BelleBook.

## Environment Variables

### Backend (.env)

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=your-jwt-secret-here

# API URLs
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Getting Stripe API Keys

### 1. Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a Stripe account
3. Complete the verification process

### 2. Get API Keys

1. Navigate to **Developers** → **API keys** in the Stripe Dashboard
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_...`) → Frontend
   - **Secret key** (starts with `sk_test_...`) → Backend

### 3. Set up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://your-api-domain.com/payments/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_...`)

## Testing

### Test Cards

Stripe provides test cards for different scenarios:

```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
🔐 3D Secure: 4000 0025 0000 3155
💳 Insufficient funds: 4000 0000 0000 9995
```

Use any future expiration date and any 3-digit CVC.

### Testing Webhooks Locally

Install Stripe CLI:

```bash
# Windows (with Scoop)
scoop install stripe

# macOS
brew install stripe/stripe-cli/stripe

# Or download from https://github.com/stripe/stripe-cli/releases
```

Forward webhooks to local server:

```bash
stripe listen --forward-to localhost:3001/payments/webhook
```

This will give you a webhook signing secret for local testing.

Trigger test events:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed
```

## Payment Flow

### 1. Customer initiates payment
- Frontend creates a booking
- Backend creates a payment intent via Stripe API
- Backend returns `clientSecret` to frontend

### 2. Customer enters payment details
- Frontend displays Stripe Payment Element
- Customer enters card information
- Stripe validates card details

### 3. Payment confirmation
- Frontend confirms payment with Stripe
- Stripe processes payment
- 3D Secure authentication if required

### 4. Webhook notification
- Stripe sends webhook to backend
- Backend verifies webhook signature
- Backend updates booking status
- Backend sends confirmation email
- Backend awards loyalty points

### 5. Success redirect
- Customer redirected to success page
- Booking confirmed
- Receipt displayed

## API Endpoints

### POST `/payments/create-intent`
Create a payment intent for a booking.

**Request:**
```json
{
  "bookingId": "clx123...",
  "amount": 150.00,
  "metadata": {
    "bookingId": "clx123...",
    "source": "web"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 150.00
}
```

### POST `/payments/confirm`
Manually confirm a payment (alternative flow).

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "bookingId": "clx123..."
}
```

### GET `/payments/:bookingId/status`
Check payment status for a booking.

**Response:**
```json
{
  "booking": {
    "id": "clx123...",
    "paymentStatus": "PAID",
    "paymentMethod": "CREDIT_CARD",
    "totalPaid": 150.00
  },
  "paymentIntent": {
    "id": "pi_xxx",
    "status": "succeeded",
    "amount": 150.00,
    "currency": "brl"
  }
}
```

### POST `/payments/refund`
Process a refund for a booking.

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "amount": 75.00,  // Optional: partial refund
  "reason": "requested_by_customer"  // Optional
}
```

### POST `/payments/webhook` (No auth required)
Stripe webhook endpoint for payment events.

## Security Best Practices

### ✅ DO:
- Always verify webhook signatures
- Use HTTPS in production
- Store API keys in environment variables
- Log all payment attempts for audit
- Implement rate limiting on payment endpoints
- Use Stripe's latest API version
- Enable 3D Secure authentication
- Monitor suspicious activity

### ❌ DON'T:
- Never store card details
- Never log sensitive payment information
- Never expose secret keys in frontend
- Don't process payments without webhooks
- Don't skip signature verification

## Monitoring & Analytics

Track these metrics in your dashboard:

1. **Payment Success Rate**
   - Target: > 95%
   - Monitor failed payment reasons

2. **Average Processing Time**
   - Track from intent creation to confirmation

3. **Refund Rate**
   - Monitor refund requests and reasons

4. **Revenue Metrics**
   - Total revenue
   - Revenue per service
   - Revenue per customer

5. **Dispute Rate**
   - Chargebacks and disputes
   - Target: < 0.75%

## Troubleshooting

### Payment Intent Creation Fails

**Error:** `Invalid API Key`
- Check that `STRIPE_SECRET_KEY` is set correctly
- Ensure you're using the correct key for your environment (test/live)

**Error:** `Amount must be at least 0.50 brl`
- Stripe has minimum charge amounts per currency
- For BRL, minimum is R$ 0.50

### Webhook Not Receiving Events

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check firewall/proxy settings
4. Use Stripe CLI for local testing
5. Check Stripe Dashboard logs

### 3D Secure Authentication Issues

- Ensure `automatic_payment_methods` is enabled
- Test with 3D Secure test cards
- Handle `requires_action` status properly

## Going Live

### Checklist before production:

- [ ] Replace test API keys with live keys
- [ ] Set up production webhook endpoint
- [ ] Configure webhook to use HTTPS
- [ ] Test with real bank cards (small amounts)
- [ ] Set up Stripe Radar for fraud detection
- [ ] Configure email receipts in Stripe
- [ ] Set up tax collection if required
- [ ] Review and accept Stripe's terms
- [ ] Test refund flow
- [ ] Set up monitoring and alerts
- [ ] Document runbook for common issues

### Switch to Live Mode:

1. Get live API keys from Stripe Dashboard
2. Update environment variables
3. Create new webhook endpoint for production
4. Test thoroughly with real cards
5. Monitor closely for first week

## Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** support@stripe.com
- **Status Page:** https://status.stripe.com

## Related Documentation

- [Phase 4: Payments Implementation](./PHASE_4_PAYMENTS_STRIPE.md)
- [Backend API Documentation](./API_DOCUMENTATION.md)
- [Security Guidelines](./SECURITY.md)
