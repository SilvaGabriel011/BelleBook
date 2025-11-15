# SendGrid Email Service - BelleBook

Production-grade email service implementation with SendGrid and BullMQ queue for scheduled emails.

## Features

✅ **7 Beautiful HTML Email Templates**
- Booking Confirmation
- Booking Reminder (48h before)
- Booking Cancellation
- Payment Receipt
- Review Request (48h after)
- Welcome Email
- Password Reset

✅ **SendGrid Integration**
- Type-safe email sending
- Template rendering with Handlebars
- Automatic plain-text generation
- Error handling & logging

✅ **BullMQ Queue for Scheduled Emails**
- Automatic retry with exponential backoff
- Job persistence with Redis
- Queue monitoring & statistics
- Clean old jobs automatically

✅ **Production Ready**
- Graceful fallback when SendGrid not configured
- Comprehensive logging
- Environment-based configuration
- Type-safe APIs

## Setup

### 1. Install Dependencies

```bash
cd bellebook-backend
npm install
```

Dependencies added:
- `@sendgrid/mail` - SendGrid SDK
- `@nestjs/bullmq` - NestJS BullMQ integration
- `bullmq` - Modern queue system
- `handlebars` - Template engine

### 2. Set up Redis

BullMQ requires Redis for queue persistence.

**Development (Docker)**:
```bash
docker run -d -p 6379:6379 redis
```

**Production**: Use a hosted Redis service:
- [Redis Cloud](https://redis.com/cloud/)
- [Railway Redis](https://railway.app/)
- [Render Redis](https://render.com/)

### 3. Configure Environment Variables

Update your `.env` file:

```env
# SendGrid
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@bellebook.com
SENDGRID_FROM_NAME=BelleBook

# Redis (BullMQ Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3001
```

### 4. Get SendGrid API Key

1. Create account at [SendGrid](https://sendgrid.com)
2. Go to **Settings > API Keys**
3. Click **Create API Key**
4. Give it a name and select **Full Access** or **Mail Send** permissions
5. Copy the API key to your `.env` file

### 5. Update App Module

Add BullMQ module to your `app.module.ts`:

```typescript
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    // ... other imports
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    NotificationsModule,
  ],
})
export class AppModule {}
```

## Usage

### Send Immediate Emails

```typescript
import { NotificationsService } from './notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  async createBooking(data: CreateBookingDto) {
    // Create booking...
    
    // Send confirmation email
    await this.notificationsService.sendBookingConfirmation({
      recipientEmail: customer.email,
      customerName: customer.name,
      serviceName: service.name,
      providerName: provider.name,
      formattedDate: '15 de Novembro de 2024',
      formattedTime: '14:00',
      duration: 60,
      price: '150,00',
      address: 'Rua Example, 123',
      calendarLink: 'https://calendar.google.com/...',
      bookingUrl: 'https://bellebook.com/bookings/123',
    });
  }
}
```

### Schedule Future Emails

```typescript
async createBooking(data: CreateBookingDto) {
  // Create booking...
  
  // Schedule reminder 48h before
  const reminderTime = new Date(booking.scheduledTime);
  reminderTime.setHours(reminderTime.getHours() - 48);
  
  await this.notificationsService.scheduleBookingReminder(
    {
      recipientEmail: customer.email,
      customerName: customer.name,
      serviceName: service.name,
      providerName: provider.name,
      formattedDate: '17 de Novembro de 2024',
      formattedTime: '14:00',
      address: 'Rua Example, 123',
      bookingUrl: 'https://bellebook.com/bookings/123',
    },
    reminderTime,
  );
  
  // Schedule review request 48h after
  const reviewTime = new Date(booking.scheduledTime);
  reviewTime.setHours(reviewTime.getHours() + 48);
  
  await this.notificationsService.scheduleReviewRequest(
    {
      recipientEmail: customer.email,
      customerName: customer.name,
      serviceName: service.name,
      providerName: provider.name,
      formattedDate: '15 de Novembro de 2024',
      reviewUrl: 'https://bellebook.com/reviews/new?booking=123',
      bookingUrl: 'https://bellebook.com',
      supportEmail: 'support@bellebook.com',
    },
    reviewTime,
  );
}
```

### Monitor Queue

```typescript
async getEmailQueueStatus() {
  const stats = await this.notificationsService.getQueueStats();
  
  console.log('Email Queue Status:', {
    waiting: stats.waiting,      // Jobs waiting to be processed
    active: stats.active,         // Jobs currently being processed
    completed: stats.completed,   // Jobs completed successfully
    failed: stats.failed,         // Jobs that failed
    delayed: stats.delayed,       // Scheduled jobs
  });
}
```

## Email Templates

All templates follow BelleBook's brand colors:
- Primary Pink: `#FF6B9D`
- Light Pink: `#FFC8DD`
- Success Green: `#4CAF50`
- Accent Purple: `#E4C1F9`

Templates are located in `src/notifications/templates/`:
- `base.html` - Base layout with header/footer
- `booking-confirmation.html` - Booking details + calendar link
- `booking-reminder.html` - Reminder 48h before
- `booking-cancelled.html` - Cancellation confirmation
- `payment-receipt.html` - Payment details + receipt
- `review-request.html` - Request review with star rating
- `welcome.html` - New user welcome
- `password-reset.html` - Password reset link

### Customize Templates

Templates use Handlebars syntax. To customize:

1. Edit HTML files in `src/notifications/templates/`
2. Add variables with `{{variableName}}`
3. Update TypeScript types in `src/notifications/types/email.types.ts`
4. Restart the server (templates are cached)

## Testing

### Test Email Sending

```typescript
// In development, emails are logged to console if SendGrid is not configured
await this.notificationsService.sendWelcomeEmail({
  recipientEmail: 'test@example.com',
  customerName: 'Test User',
  exploreUrl: 'https://bellebook.com/services',
  dashboardUrl: 'https://bellebook.com/dashboard',
  supportEmail: 'support@bellebook.com',
});
```

### Verify SendGrid Connection

```typescript
const service = this.notificationsService.getEmailServiceStatus();
console.log('SendGrid configured:', service.configured);
```

## Queue Management

### Clean Old Jobs

```typescript
// Clean jobs older than 24 hours
await this.notificationsService.cleanQueue(24 * 60 * 60 * 1000);
```

### Retry Failed Jobs

BullMQ automatically retries failed jobs 3 times with exponential backoff (2s, 4s, 8s).

Configure in `notifications.module.ts`:
```typescript
BullModule.registerQueue({
  name: 'email',
  defaultJobOptions: {
    attempts: 3,  // Number of retry attempts
    backoff: {
      type: 'exponential',
      delay: 2000,  // Initial delay in ms
    },
  },
})
```

## Production Checklist

- [ ] Set up SendGrid account and verify domain
- [ ] Add SPF/DKIM records for better deliverability
- [ ] Set up hosted Redis (Redis Cloud, Railway, etc.)
- [ ] Configure environment variables in production
- [ ] Test email sending in staging environment
- [ ] Set up email monitoring/alerts
- [ ] Configure rate limits if needed
- [ ] Add unsubscribe functionality
- [ ] GDPR compliance check

## Troubleshooting

### Emails not sending

1. Check SendGrid API key is valid
2. Verify `SENDGRID_API_KEY` environment variable is set
3. Check logs for errors
4. Verify sender email is verified in SendGrid

### Queue not processing

1. Check Redis is running: `redis-cli ping` should return `PONG`
2. Verify Redis connection settings in `.env`
3. Check BullMQ logs for processor errors
4. Restart the application

### Templates not updating

Templates are cached. To force reload:
- Restart the application
- Or call `templateService.clearCache()`

## Architecture

```
notifications/
├── services/
│   ├── sendgrid.service.ts      # SendGrid integration
│   └── template.service.ts       # Template rendering
├── processors/
│   └── email.processor.ts        # BullMQ queue processor
├── templates/
│   ├── base.html                 # Base layout
│   └── *.html                    # Email templates
├── types/
│   └── email.types.ts            # TypeScript types
├── notifications.service.ts      # Main notification service
└── notifications.module.ts       # Module configuration
```

## Next Steps

- [ ] Implement WhatsApp notifications (Phase 6)
- [ ] Add email open tracking
- [ ] Add email click tracking
- [ ] Implement email preferences/unsubscribe
- [ ] A/B testing for email templates
- [ ] Email analytics dashboard

## Support

For issues or questions:
- Check the logs for detailed error messages
- Review SendGrid dashboard for delivery status
- Contact: support@bellebook.com
