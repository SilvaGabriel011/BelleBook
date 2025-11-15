/**
 * Email template types for type-safe email sending
 * Ensures all required data is provided for each email template
 */

export interface BaseEmailData {
  recipientEmail: string;
  customerName: string;
  year?: number;
  unsubscribeUrl?: string;
}

export interface BookingConfirmationData extends BaseEmailData {
  serviceName: string;
  providerName: string;
  formattedDate: string;
  formattedTime: string;
  duration: number;
  price: string;
  address?: string;
  calendarLink: string;
  bookingUrl: string;
  servicePreparation?: string;
}

export interface BookingReminderData extends BaseEmailData {
  serviceName: string;
  providerName: string;
  formattedDate: string;
  formattedTime: string;
  address?: string;
  bookingUrl: string;
  servicePreparation?: string;
}

export interface BookingCancelledData extends BaseEmailData {
  serviceName: string;
  formattedDate: string;
  formattedTime: string;
  cancelledAt: string;
  cancellationReason?: string;
  refundAmount?: string;
  bookingUrl: string;
  supportEmail: string;
}

export interface PaymentItem {
  name: string;
  price: string;
}

export interface PaymentReceiptData extends BaseEmailData {
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  last4?: string;
  items: PaymentItem[];
  discount?: string;
  totalAmount: string;
  receiptUrl: string;
  supportEmail: string;
  bookingConfirmed?: boolean;
  serviceName?: string;
  formattedDate?: string;
  formattedTime?: string;
}

export interface ReviewRequestData extends BaseEmailData {
  serviceName: string;
  providerName: string;
  formattedDate: string;
  reviewUrl: string;
  bookingUrl: string;
  supportEmail: string;
}

export interface WelcomeData extends BaseEmailData {
  exploreUrl: string;
  dashboardUrl: string;
  supportEmail: string;
}

export interface PasswordResetData extends BaseEmailData {
  resetLink: string;
  supportEmail: string;
}

export type EmailTemplateData =
  | BookingConfirmationData
  | BookingReminderData
  | BookingCancelledData
  | PaymentReceiptData
  | ReviewRequestData
  | WelcomeData
  | PasswordResetData;

export enum EmailTemplate {
  BOOKING_CONFIRMATION = 'booking-confirmation',
  BOOKING_REMINDER = 'booking-reminder',
  BOOKING_CANCELLED = 'booking-cancelled',
  PAYMENT_RECEIPT = 'payment-receipt',
  REVIEW_REQUEST = 'review-request',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}
