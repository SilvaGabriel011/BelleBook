import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import {
  EmailOptions,
  EmailTemplate,
  EmailTemplateData,
} from '../types/email.types';
import { TemplateService } from './template.service';

/**
 * SendGrid Email Service
 * Handles all email sending through SendGrid API
 */
@Injectable()
export class SendGridService implements OnModuleInit {
  private readonly logger = new Logger(SendGridService.name);
  private fromEmail: string;
  private fromName: string;
  private isConfigured = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  /**
   * Initialize SendGrid on module initialization
   */
  async onModuleInit(): Promise<void> {
    try {
      const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
      this.fromEmail =
        this.configService.get<string>('SENDGRID_FROM_EMAIL') ||
        'noreply@bellebook.com';
      this.fromName =
        this.configService.get<string>('SENDGRID_FROM_NAME') || 'BelleBook';

      if (!apiKey) {
        this.logger.warn(
          'SendGrid API key not configured. Email sending will be simulated.',
        );
        return;
      }

      SendGrid.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log(
        `SendGrid initialized successfully. Emails will be sent from: ${this.fromName} <${this.fromEmail}>`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize SendGrid:', error);
      throw error;
    }
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(
    template: EmailTemplate,
    data: EmailTemplateData,
  ): Promise<boolean> {
    try {
      // Render the template
      const html = await this.templateService.render(template, data);
      const text = this.templateService.generatePlainText(html);
      const subject = this.templateService.getEmailSubject(
        template,
        data.customerName,
      );

      // Send the email
      return await this.sendEmail({
        to: data.recipientEmail,
        subject,
        html,
        text,
      });
    } catch (error) {
      this.logger.error(`Failed to send template email ${template}:`, error);
      throw error;
    }
  }

  /**
   * Send a raw email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const emailData: SendGrid.MailDataRequired = {
        to: options.to,
        from: options.from || {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: options.subject,
        html: options.html,
        text:
          options.text || this.templateService.generatePlainText(options.html),
        replyTo: options.replyTo,
        attachments: options.attachments,
      };

      if (!this.isConfigured) {
        // Simulate sending email in development
        this.logger.log('📧 [SIMULATED EMAIL]');
        this.logger.log(`To: ${options.to}`);
        this.logger.log(`Subject: ${options.subject}`);
        this.logger.log(`Preview: ${options.html.substring(0, 200)}...`);
        return true;
      }

      // Send via SendGrid
      await SendGrid.send(emailData);
      this.logger.log(`✓ Email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);

      // Log SendGrid specific errors
      if (error.response) {
        this.logger.error('SendGrid Error Response:', {
          statusCode: error.response.statusCode,
          body: error.response.body,
        });
      }

      // Don't throw in production to prevent blocking operations
      if (this.configService.get('NODE_ENV') === 'production') {
        return false;
      }

      throw error;
    }
  }

  /**
   * Send batch emails (useful for newsletters, notifications)
   */
  async sendBatchEmails(
    emails: Array<{ to: string; subject: string; html: string }>,
  ): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 };

    for (const email of emails) {
      try {
        await this.sendEmail(email);
        results.success++;
      } catch (error) {
        results.failed++;
        this.logger.error(`Failed to send batch email to ${email.to}:`, error);
      }
    }

    this.logger.log(
      `Batch email complete: ${results.success} success, ${results.failed} failed`,
    );
    return results;
  }

  /**
   * Verify SendGrid connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        this.logger.warn('SendGrid not configured, skipping verification');
        return false;
      }

      // Send a test request to verify API key
      await SendGrid.send({
        to: this.fromEmail,
        from: this.fromEmail,
        subject: 'SendGrid Connection Test',
        text: 'This is a test email to verify SendGrid connection.',
        mailSettings: {
          sandboxMode: {
            enable: true, // Don't actually send the email
          },
        },
      });

      this.logger.log('✓ SendGrid connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('✗ SendGrid connection verification failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    configured: boolean;
    fromEmail: string;
    fromName: string;
  } {
    return {
      configured: this.isConfigured,
      fromEmail: this.fromEmail,
      fromName: this.fromName,
    };
  }
}
