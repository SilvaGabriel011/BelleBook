# Phase 4: Stripe Payment Integration

**Duration**: 1 week | **Priority**: HIGH

## Setup

### Install Dependencies

```bash
# Backend
cd bellebook-backend
npm install stripe

# Frontend  
cd bellebook-web
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Environment Variables

```env
# Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Backend Implementation

### Files to Create

1. `bellebook-backend/src/payments/payments.module.ts`
2. `bellebook-backend/src/payments/payments.service.ts`
3. `bellebook-backend/src/payments/payments.controller.ts`
4. `bellebook-backend/src/payments/stripe.service.ts`
5. `bellebook-backend/src/payments/dto/create-payment-intent.dto.ts`

### Stripe Service

```typescript
@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, metadata: any) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'brl',
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({ email, name });
  }

  async retrievePaymentIntent(id: string) {
    return this.stripe.paymentIntents.retrieve(id);
  }
}
```

### API Endpoints

```typescript
POST   /payments/create-intent          // Create payment intent
POST   /payments/confirm                // Confirm payment
POST   /payments/webhook                // Stripe webhook
GET    /payments/:bookingId/status      // Payment status
POST   /payments/refund                 // Process refund
GET    /payments/methods                // Saved payment methods
```

### Webhook Handler

```typescript
@Post('webhook')
async handleWebhook(@Req() req: RawBodyRequest<Request>) {
  const sig = req.headers['stripe-signature'];
  
  const event = this.stripe.webhooks.constructEvent(
    req.rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await this.handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await this.handlePaymentFailure(event.data.object);
      break;
  }

  return { received: true };
}
```

## Frontend Implementation

### Files to Create

1. `bellebook-web/lib/stripe.ts` - Stripe initialization
2. `bellebook-web/components/booking/PaymentForm.tsx` - Payment form
3. `bellebook-web/app/(customer)/booking/success/page.tsx` - Success page
4. `bellebook-web/app/(customer)/booking/cancelled/page.tsx` - Cancelled page

### Stripe Initialization

```typescript
// lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

### Payment Form Component

```typescript
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm({ clientSecret, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}
```

## Payment Flow

### 1. Create Payment Intent (Backend)
```
Client → POST /payments/create-intent
Body: { amount, bookingId, metadata }
Response: { clientSecret, paymentIntentId }
```

### 2. Display Payment Form (Frontend)
```
<Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>
```

### 3. Confirm Payment (Stripe)
- User enters card details
- Stripe validates and processes
- 3D Secure authentication if required
- Redirects to success/failure page

### 4. Handle Webhook (Backend)
- Receive payment_intent.succeeded event
- Update booking status to CONFIRMED
- Update payment status to PAID
- Send confirmation email
- Schedule reminders

### 5. Show Confirmation (Frontend)
- Display booking details
- Show receipt
- Offer to add to calendar
- Share booking option

## Payment Methods Supported

- Credit Cards (Visa, Mastercard, Amex)
- Debit Cards
- Pix (Brazil) - Future enhancement
- Digital Wallets (Apple Pay, Google Pay)

## Security Best Practices

- Never store card details
- Use HTTPS everywhere
- Validate webhook signatures
- Log all payment attempts
- Implement fraud detection
- Rate limit payment endpoints
- Use SCA (Strong Customer Authentication)

## Error Handling

### Common Errors
- Card declined → Suggest retry or different card
- Insufficient funds → Show clear message
- 3D Secure failed → Explain authentication needed
- Network timeout → Save state, allow retry
- Invalid card → Show validation error

### Retry Logic
```typescript
const retryPayment = async (paymentIntentId) => {
  // Allow user to retry with same or different card
  // Maximum 3 attempts before requiring new booking
};
```

## Refund Policy

### Full Refund
- Cancellation > 24 hours before appointment
- Provider cancellation
- Technical issues

### Partial Refund (50%)
- Cancellation 12-24 hours before

### No Refund
- Cancellation < 12 hours before
- No-show

### Implementation
```typescript
async refundPayment(paymentIntentId: string, amount?: number) {
  return this.stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined, // Full refund if not specified
  });
}
```

## Testing

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
Insufficient funds: 4000 0000 0000 9995
```

### Test Checklist
- [ ] Payment intent creates successfully
- [ ] Payment form loads
- [ ] Card validation works
- [ ] 3D Secure flow completes
- [ ] Successful payment updates booking
- [ ] Failed payment shows error
- [ ] Webhook processes correctly
- [ ] Receipt generated
- [ ] Refunds process correctly
- [ ] Email notifications sent
- [ ] Payment methods save (if enabled)

## Monitoring

Track these metrics:
- Payment success rate (target > 95%)
- Average processing time
- Failed payment reasons
- Refund rate
- Dispute rate
- Revenue per booking

**Next**: [Phase 5: SendGrid Emails](./PHASE_5_EMAILS_SENDGRID.md)
