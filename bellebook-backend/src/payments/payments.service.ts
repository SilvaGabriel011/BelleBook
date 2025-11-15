import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';
import {
  CreatePaymentIntentDto,
  ConfirmPaymentDto,
  RefundPaymentDto,
} from './dto/create-payment-intent.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  /**
   * Create a payment intent for a booking
   */
  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        user: true,
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (booking.paymentStatus === 'PAID') {
      throw new BadRequestException('Este agendamento já foi pago');
    }

    // Prepare metadata
    const metadata = {
      bookingId: booking.id,
      userId: booking.userId,
      serviceId: booking.serviceId,
      customerEmail: booking.user.email,
      customerName: booking.user.name,
      ...dto.metadata,
    };

    try {
      // Create payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent(
        dto.amount,
        metadata,
      );

      // Update booking with payment intent ID
      await this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: {
          paymentId: paymentIntent.id,
          paymentStatus: 'PENDING',
        },
      });

      this.logger.log(
        `Payment intent created for booking ${booking.id}: ${paymentIntent.id}`,
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
      };
    } catch (error) {
      this.logger.error('Error creating payment intent', error);
      throw new BadRequestException('Erro ao criar intenção de pagamento');
    }
  }

  /**
   * Confirm payment success
   */
  async confirmPayment(dto: ConfirmPaymentDto) {
    const paymentIntent = await this.stripeService.retrievePaymentIntent(
      dto.paymentIntentId,
    );

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Pagamento não foi concluído com sucesso');
    }

    const booking = await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        service: true,
      },
    });

    this.logger.log(`Payment confirmed for booking ${booking.id}`);

    return {
      success: true,
      booking,
      message: 'Pagamento confirmado com sucesso!',
    };
  }

  /**
   * Get payment status for a booking
   */
  async getPaymentStatus(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        paymentStatus: true,
        paymentMethod: true,
        paymentId: true,
        totalPaid: true,
        status: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    let paymentIntent: Stripe.PaymentIntent | null = null;
    if (booking.paymentId) {
      try {
        paymentIntent = await this.stripeService.retrievePaymentIntent(
          booking.paymentId,
        );
      } catch (error) {
        this.logger.warn(
          `Could not retrieve payment intent: ${booking.paymentId}`,
        );
      }
    }

    return {
      booking,
      paymentIntent: paymentIntent
        ? {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
          }
        : null,
    };
  }

  /**
   * Process refund for a booking
   */
  async refundPayment(dto: RefundPaymentDto) {
    const booking = await this.prisma.booking.findFirst({
      where: { paymentId: dto.paymentIntentId },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (booking.paymentStatus !== 'PAID') {
      throw new BadRequestException('Este agendamento não foi pago');
    }

    try {
      const refund = await this.stripeService.refundPayment(
        dto.paymentIntentId,
        dto.amount,
        dto.reason,
      );

      await this.prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'REFUNDED',
          status: 'CANCELLED',
        },
      });

      this.logger.log(
        `Refund processed for booking ${booking.id}: ${refund.id}`,
      );

      return {
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status,
        },
        message: 'Reembolso processado com sucesso',
      };
    } catch (error) {
      this.logger.error('Error processing refund', error);
      throw new BadRequestException('Erro ao processar reembolso');
    }
  }

  /**
   * Handle Stripe webhook payment success
   */
  async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (!bookingId) {
      this.logger.warn('Payment intent without bookingId in metadata');
      return;
    }

    try {
      const booking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          paymentMethod: 'CREDIT_CARD',
        },
        include: {
          user: true,
          service: true,
        },
      });

      // Award loyalty points (e.g., 1 point per R$ 10)
      const pointsToAward = Math.floor(Number(booking.totalPaid) / 10);
      if (pointsToAward > 0) {
        await this.prisma.user.update({
          where: { id: booking.userId },
          data: {
            points: {
              increment: pointsToAward,
            },
          },
        });
      }

      // Create notification
      await this.prisma.notification.create({
        data: {
          userId: booking.userId,
          type: 'PAYMENT_SUCCESS',
          title: 'Pagamento Confirmado! 💳',
          message: `Seu pagamento de R$ ${booking.totalPaid} foi confirmado. Agendamento confirmado para ${new Date(booking.date).toLocaleDateString()}.`,
        },
      });

      this.logger.log(
        `Payment success processed for booking ${bookingId}, awarded ${pointsToAward} points`,
      );
    } catch (error) {
      this.logger.error('Error handling payment success', error);
    }
  }

  /**
   * Handle Stripe webhook payment failure
   */
  async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;

    if (!bookingId) {
      this.logger.warn('Payment intent without bookingId in metadata');
      return;
    }

    try {
      const booking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'FAILED',
        },
        include: {
          user: true,
        },
      });

      // Create notification
      await this.prisma.notification.create({
        data: {
          userId: booking.userId,
          type: 'PAYMENT_FAILED',
          title: 'Falha no Pagamento',
          message: `Houve um problema com seu pagamento. Por favor, tente novamente.`,
        },
      });

      this.logger.log(`Payment failure processed for booking ${bookingId}`);
    } catch (error) {
      this.logger.error('Error handling payment failure', error);
    }
  }

  /**
   * Get saved payment methods for a user
   */
  async getPaymentMethods(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // For now, we don't store customer IDs, so return empty array
    // In production, you'd store Stripe customer ID in user model
    return {
      paymentMethods: [],
      message: 'Métodos de pagamento salvos não disponíveis ainda',
    };
  }
}
