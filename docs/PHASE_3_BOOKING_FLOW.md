# Phase 3: Booking Flow

**Duration**: 2 weeks | **Priority**: HIGH

## Shopping Cart System

### Cart Store
Create `bellebook-web/stores/cart.store.ts`:

```typescript
interface CartItem {
  id: string;
  serviceId: string;
  variantId?: string;
  serviceName: string;
  price: number;
  duration: number;
  quantity: number;
}

// Actions: addItem, removeItem, updateQuantity, clearCart
// Computed: totalItems, totalPrice, totalDuration
```

### Cart Features
- Persistent (localStorage)
- Cross-tab sync
- Promo code application
- Loyalty points redemption
- Service quantity limits

## Multi-Step Booking Process

### Step 1: Review Cart
- Display cart items
- Adjust quantities
- Remove items
- Apply promo code
- Show subtotal, discount, total

### Step 2: Select Provider & Schedule
- Provider selection with filters (rating, specialty, availability)
- Calendar integration (Google Calendar API)
- Time slot selection (15-min intervals)
- Duration calculation
- Busy slots indication
- Provider profile popup

### Step 3: Customer Information
- Name, email, phone (pre-filled if logged in)
- Special requests/notes textarea
- Communication preferences checkboxes
- Emergency contact (optional)

### Step 4: Payment Method
- Credit card (Stripe)
- Debit card (Stripe)
- Pix (future)
- Pay on-site (cash/card)
- Use loyalty points

### Step 5: Confirmation
- Booking summary
- Confirmation number
- Total cost breakdown
- Provider details
- Add to calendar button
- Share button
- Print button

## Files to Create

1. `bellebook-web/app/(customer)/booking/page.tsx` - Main booking flow
2. `bellebook-web/components/booking/BookingStep1Cart.tsx` - Cart review
3. `bellebook-web/components/booking/BookingStep2Schedule.tsx` - Scheduling
4. `bellebook-web/components/booking/BookingStep3Info.tsx` - Customer info
5. `bellebook-web/components/booking/BookingStep4Payment.tsx` - Payment
6. `bellebook-web/components/booking/BookingStep5Confirmation.tsx` - Confirmation
7. `bellebook-web/components/booking/ProgressIndicator.tsx` - Step indicator
8. `bellebook-web/stores/booking.store.ts` - Booking state
9. `bellebook-web/services/booking.api.ts` - Booking API client

## Schedule Selection Integration

### Google Calendar API
- Fetch provider busy slots
- Display available times
- Handle timezone conversion
- Real-time availability updates

### Time Slot Display
```typescript
// Show slots in 15-minute intervals
// Group by time of day: Morning, Afternoon, Evening
// Indicate popular times with badge
// Show "Almost Full" for limited availability
```

## Booking State Management

```typescript
interface BookingState {
  step: number;
  services: CartItem[];
  providerId?: string;
  scheduledAt?: Date;
  customerInfo?: CustomerInfo;
  paymentMethod?: PaymentMethod;
  promoCode?: string;
  notes?: string;
  totalAmount: number;
  discount: number;
}
```

## Backend Requirements

### Add to `prisma/schema.prisma`:

```prisma
model Booking {
  id              String   @id @default(uuid())
  userId          String
  providerId      String
  services        Json     // [{serviceId, variantId, quantity, price}]
  scheduledAt     DateTime
  duration        Int
  status          String   // PENDING, CONFIRMED, COMPLETED, CANCELLED
  totalAmount     Float
  discount        Float    @default(0)
  promoCode       String?
  paymentMethod   String
  paymentStatus   String   // PENDING, PAID, REFUNDED
  customerNotes   String?
  
  user            User     @relation(fields: [userId], references: [id])
  provider        User     @relation("ProviderBookings", fields: [providerId], references: [id])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("bookings")
}

model PromoCode {
  id          String   @id @default(uuid())
  code        String   @unique
  type        String   // PERCENTAGE, FIXED
  value       Float
  minAmount   Float?
  maxUses     Int?
  usedCount   Int      @default(0)
  validFrom   DateTime
  validUntil  DateTime
  isActive    Boolean  @default(true)
  
  @@map("promo_codes")
}
```

### API Endpoints

```typescript
POST   /bookings                    // Create booking
GET    /bookings/:id                // Get booking details
PATCH  /bookings/:id/reschedule     // Reschedule booking
DELETE /bookings/:id                // Cancel booking
GET    /bookings/my-bookings        // User's bookings
GET    /providers/:id/availability  // Available slots
POST   /promo-codes/validate        // Validate promo code
```

## Validation Rules

- Booking must be at least 2 hours in advance
- Maximum 5 services per booking
- Provider availability check
- Duplicate booking prevention
- Business hours validation (8am - 8pm)

## Implementation Steps

1. Create cart store with persistence
2. Build cart page/drawer
3. Create booking store
4. Implement progress indicator
5. Build Step 1: Cart review
6. Build Step 2: Provider selection
7. Integrate Google Calendar for scheduling
8. Build Step 3: Customer info form
9. Build Step 4: Payment selection (placeholder)
10. Build Step 5: Confirmation page
11. Create booking API endpoints
12. Add promo code validation
13. Implement booking creation flow
14. Add error handling and retries
15. Test complete flow

## Error Handling

- Provider unavailable → Show alternative providers
- Time slot taken → Refresh and show nearby slots
- Payment failed → Allow retry or change method
- Network error → Save progress, allow resume
- Validation errors → Clear messaging with solutions

## Testing Checklist

- [ ] Cart persists across sessions
- [ ] Can add/remove services
- [ ] Promo code validation works
- [ ] Provider selection filters work
- [ ] Calendar shows correct availability
- [ ] Cannot book overlapping slots
- [ ] Customer info validates correctly
- [ ] Booking creation succeeds
- [ ] Confirmation page displays all details
- [ ] Email confirmation sent
- [ ] Can navigate back/forward between steps
- [ ] Mobile responsive
- [ ] Loading states clear
- [ ] Error messages helpful

**Next**: [Phase 4: Stripe Payments](./PHASE_4_PAYMENTS_STRIPE.md)
