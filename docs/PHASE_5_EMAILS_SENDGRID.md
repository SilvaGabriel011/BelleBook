# Phase 5: SendGrid Email Service

**Duration**: 3 days | **Priority**: MEDIUM

## Setup

```bash
npm install @sendgrid/mail
```

**Env**: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME`

## Email Templates (HTML)

Create in `bellebook-backend/src/notifications/templates/`:

1. `booking-confirmation.html` - Booking details, add to calendar
2. `booking-reminder.html` - 48h before reminder
3. `booking-cancelled.html` - Cancellation confirmation
4. `payment-receipt.html` - Payment receipt
5. `review-request.html` - Request review after service
6. `welcome.html` - New user welcome
7. `password-reset.html` - Password reset link

## Notification Schedule

- Registration → Welcome email (immediate)
- Booking created → Confirmation (immediate)
- Payment success → Receipt (immediate)
- 48h before → Reminder
- Booking cancelled → Cancellation (immediate)
- 48h after → Review request

## Implementation

Update `notifications.service.ts` with SendGrid integration and template rendering using Handlebars.

Use Bull queue for scheduled emails (reminders, review requests).

**Next**: [Phase 6: WhatsApp](./PHASE_6_WHATSAPP_NOTIFICATIONS.md)
