import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private config: ConfigService) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured. Payment features will not work.');
      return;
    }

    this.stripe = new Stripe(secretKey);

    this.logger.log('Stripe service initialized successfully');
  }

  /**
   * Create a payment intent for a booking
   */
  async createPaymentIntent(
    amount: number,
    metadata: Record<string, any>,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'brl',
        metadata,
        automatic_payment_methods: { enabled: true },
        description: `Pagamento BelleBook - ${metadata.bookingId || 'N/A'}`,
      });

      this.logger.log(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error('Error creating payment intent', error);
      throw error;
    }
  }

  /**
   * Create or retrieve a Stripe customer
   */
  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, any>,
  ): Promise<Stripe.Customer> {
    try {
      // Try to find existing customer first
      const existingCustomers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        this.logger.log(`Found existing customer: ${existingCustomers.data[0].id}`);
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });

      this.logger.log(`Created new customer: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Error creating customer', error);
      throw error;
    }
  }

  /**
   * Retrieve a payment intent
   */
  async retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(id);
    } catch (error) {
      this.logger.error(`Error retrieving payment intent ${id}`, error);
      throw error;
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(id);
      this.logger.log(`Payment intent cancelled: ${id}`);
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error cancelling payment intent ${id}`, error);
      throw error;
    }
  }

  /**
   * Create a refund
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundData.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      const refund = await this.stripe.refunds.create(refundData);
      this.logger.log(`Refund created: ${refund.id} for payment intent: ${paymentIntentId}`);
      return refund;
    } catch (error) {
      this.logger.error(`Error creating refund for ${paymentIntentId}`, error);
      throw error;
    }
  }

  /**
   * List payment methods for a customer
   */
  async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      this.logger.error(`Error listing payment methods for customer ${customerId}`, error);
      throw error;
    }
  }

  /**
   * Construct webhook event from raw body
   */
  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error('Error constructing webhook event', error);
      throw error;
    }
  }

  /**
   * Get Stripe instance for advanced operations
   */
  getStripeInstance(): Stripe {
    return this.stripe;
  }
}
