import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  RawBodyRequest,
  Headers,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreatePaymentIntentDto,
  ConfirmPaymentDto,
  RefundPaymentDto,
} from './dto/create-payment-intent.dto';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  async confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(dto);
  }

  @Get(':bookingId/status')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentStatus(bookingId);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return this.paymentsService.refundPayment(dto);
  }

  @Get('methods')
  @UseGuards(JwtAuthGuard)
  async getPaymentMethods(@Req() req: any) {
    return this.paymentsService.getPaymentMethods(req.user.sub);
  }

  /**
   * Stripe webhook endpoint
   * This endpoint receives webhooks from Stripe when payment events occur
   * IMPORTANT: This endpoint must be excluded from body parsing middleware
   * to receive the raw body for signature verification
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      return { error: 'Missing stripe-signature header' };
    }

    try {
      // Get raw body for signature verification
      const rawBody = req.rawBody;
      
      if (!rawBody) {
        return { error: 'Missing raw body' };
      }

      // Construct and verify webhook event
      const event = this.stripeService.constructWebhookEvent(
        rawBody,
        signature,
      );

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.paymentsService.handlePaymentSuccess(
            event.data.object as any,
          );
          break;

        case 'payment_intent.payment_failed':
          await this.paymentsService.handlePaymentFailure(
            event.data.object as any,
          );
          break;

        case 'payment_intent.canceled':
          // Handle cancellation if needed
          break;

        case 'charge.refunded':
          // Handle refund confirmation if needed
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      return { error: 'Webhook handler failed' };
    }
  }
}
