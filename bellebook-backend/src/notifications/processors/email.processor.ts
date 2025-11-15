import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendGridService } from '../services/sendgrid.service';
import { EmailTemplate, EmailTemplateData } from '../types/email.types';

/**
 * Email Queue Processor
 * Handles scheduled and async email jobs
 */
@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly sendGridService: SendGridService) {
    super();
  }

  /**
   * Process all email jobs - routes based on job name
   */
  async process(job: Job): Promise<void> {
    this.logger.log(`Processing email job ${job.id}: ${job.name}`);

    try {
      switch (job.name) {
        case 'send-template':
          await this.handleTemplateEmail(job);
          break;
        case 'booking-reminder':
          await this.handleBookingReminder(job);
          break;
        case 'review-request':
          await this.handleReviewRequest(job);
          break;
        case 'batch-emails':
          await this.handleBatchEmails(job);
          break;
        default:
          this.logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`✗ Job ${job.id} failed:`, error);
      throw error; // Re-throw to trigger BullMQ retry logic
    }
  }

  /**
   * Process template email jobs
   */
  private async handleTemplateEmail(
    job: Job<{
      template: EmailTemplate;
      data: EmailTemplateData;
    }>,
  ): Promise<void> {
    await this.sendGridService.sendTemplateEmail(
      job.data.template,
      job.data.data,
    );
    this.logger.log(`✓ Template email job ${job.id} completed successfully`);
  }

  /**
   * Process booking reminder emails (scheduled 48h before)
   */
  private async handleBookingReminder(
    job: Job<EmailTemplateData>,
  ): Promise<void> {
    await this.sendGridService.sendTemplateEmail(
      EmailTemplate.BOOKING_REMINDER,
      job.data,
    );
    this.logger.log(`✓ Booking reminder ${job.id} sent successfully`);
  }

  /**
   * Process review request emails (scheduled 48h after)
   */
  private async handleReviewRequest(
    job: Job<EmailTemplateData>,
  ): Promise<void> {
    await this.sendGridService.sendTemplateEmail(
      EmailTemplate.REVIEW_REQUEST,
      job.data,
    );
    this.logger.log(`✓ Review request ${job.id} sent successfully`);
  }

  /**
   * Process batch emails
   */
  private async handleBatchEmails(
    job: Job<Array<{ to: string; subject: string; html: string }>>,
  ): Promise<void> {
    const results = await this.sendGridService.sendBatchEmails(job.data);
    this.logger.log(
      `✓ Batch email job ${job.id} completed: ${results.success} sent, ${results.failed} failed`,
    );
  }
}
