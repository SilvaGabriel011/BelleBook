import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendGridService } from './services/sendgrid.service';
import {
  EmailTemplate,
  BookingConfirmationData,
  BookingReminderData,
  BookingCancelledData,
  PaymentReceiptData,
  ReviewRequestData,
  WelcomeData,
  PasswordResetData,
} from './types/email.types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly sendGridService: SendGridService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  // ==================== BOOKING EMAILS ====================

  /**
   * Send booking confirmation email (immediate)
   */
  async sendBookingConfirmation(
    data: BookingConfirmationData,
  ): Promise<void> {
    this.logger.log(`Sending booking confirmation to ${data.recipientEmail}`);

    await this.emailQueue.add('send-template', {
      template: EmailTemplate.BOOKING_CONFIRMATION,
      data,
    });
  }

  /**
   * Schedule booking reminder email (48h before booking)
   */
  async scheduleBookingReminder(
    data: BookingReminderData,
    scheduledTime: Date,
  ): Promise<void> {
    const delay = scheduledTime.getTime() - Date.now();

    if (delay < 0) {
      this.logger.warn('Cannot schedule reminder for past date');
      return;
    }

    this.logger.log(
      `Scheduling booking reminder for ${data.recipientEmail} at ${scheduledTime}`,
    );

    await this.emailQueue.add('booking-reminder', data, {
      delay,
      jobId: `reminder-${data.recipientEmail}-${scheduledTime.getTime()}`,
    });
  }

  /**
   * Send booking cancelled email (immediate)
   */
  async sendBookingCancelled(
    data: BookingCancelledData,
  ): Promise<void> {
    this.logger.log(`Sending booking cancellation to ${data.recipientEmail}`);

    await this.emailQueue.add('send-template', {
      template: EmailTemplate.BOOKING_CANCELLED,
      data,
    });
  }

  // ==================== PAYMENT EMAILS ====================

  /**
   * Send payment receipt email (immediate)
   */
  async sendPaymentReceipt(data: PaymentReceiptData): Promise<void> {
    this.logger.log(`Sending payment receipt to ${data.recipientEmail}`);

    await this.emailQueue.add('send-template', {
      template: EmailTemplate.PAYMENT_RECEIPT,
      data,
    });
  }

  // ==================== REVIEW EMAILS ====================

  /**
   * Schedule review request email (48h after booking)
   */
  async scheduleReviewRequest(
    data: ReviewRequestData,
    scheduledTime: Date,
  ): Promise<void> {
    const delay = scheduledTime.getTime() - Date.now();

    if (delay < 0) {
      this.logger.warn('Cannot schedule review request for past date');
      return;
    }

    this.logger.log(
      `Scheduling review request for ${data.recipientEmail} at ${scheduledTime}`,
    );

    await this.emailQueue.add('review-request', data, {
      delay,
      jobId: `review-${data.recipientEmail}-${scheduledTime.getTime()}`,
    });
  }

  // ==================== USER AUTHENTICATION EMAILS ====================

  /**
   * Send welcome email to new users (immediate)
   */
  async sendWelcomeEmail(data: WelcomeData): Promise<void> {
    this.logger.log(`Sending welcome email to ${data.recipientEmail}`);

    await this.emailQueue.add('send-template', {
      template: EmailTemplate.WELCOME,
      data,
    });
  }

  /**
   * Send password reset email (immediate)
   */
  async sendPasswordReset(data: PasswordResetData): Promise<void> {
    this.logger.log(`Sending password reset to ${data.recipientEmail}`);

    await this.emailQueue.add(
      'send-template',
      {
        template: EmailTemplate.PASSWORD_RESET,
        data,
      },
      {
        priority: 1, // High priority for password resets
      },
    );
  }

  // ==================== QUEUE MANAGEMENT ====================

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.emailQueue.getWaitingCount(),
      this.emailQueue.getActiveCount(),
      this.emailQueue.getCompletedCount(),
      this.emailQueue.getFailedCount(),
      this.emailQueue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Clean old completed jobs from queue
   */
  async cleanQueue(grace: number = 24 * 60 * 60 * 1000): Promise<void> {
    await this.emailQueue.clean(grace, 1000, 'completed');
    await this.emailQueue.clean(grace, 1000, 'failed');
    this.logger.log(`Queue cleaned (grace period: ${grace}ms)`);
  }

  /**
   * Get SendGrid service status
   */
  getEmailServiceStatus(): {
    configured: boolean;
    fromEmail: string;
    fromName: string;
  } {
    return this.sendGridService.getStatus();
  }

  // ==================== ROLE REQUEST EMAILS ====================

  /**
   * Send role request created email to user
   */
  async sendRoleRequestCreated(
    _email: string,
    _name: string,
    _requestedRole: string,
  ): Promise<void> {
    this.logger.log(`Sending role request created email to ${_email}`);
  }

  /**
   * Notify admins about new role request
   */
  async notifyAdminsNewRequest(
    requestId: string,
    _userName: string,
    _requestedRole: string,
  ): Promise<void> {
    this.logger.log(`Notifying admins about new role request ${requestId}`);
  }

  /**
   * Send role request approved email to user
   */
  async sendRoleRequestApproved(
    _email: string,
    _name: string,
    _approvedRole: string,
  ): Promise<void> {
    this.logger.log(`Sending role request approved email to ${_email}`);
  }

  /**
   * Send role request rejected email to user
   */
  async sendRoleRequestRejected(
    _email: string,
    _name: string,
    _reason: string,
  ): Promise<void> {
    this.logger.log(`Sending role request rejected email to ${_email}`);
  }
}
