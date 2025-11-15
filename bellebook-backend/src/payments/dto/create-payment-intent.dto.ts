import { IsNumber, IsString, IsOptional, IsObject, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(0.5)
  amount: number;

  @IsString()
  bookingId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsString()
  bookingId: string;
}

export class RefundPaymentDto {
  @IsString()
  paymentIntentId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
