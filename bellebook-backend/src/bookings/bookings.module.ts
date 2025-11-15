import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PromoCodeService } from './promo-code.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
  imports: [PrismaModule, GoogleCalendarModule],
  controllers: [BookingsController],
  providers: [BookingsService, PromoCodeService],
  exports: [BookingsService, PromoCodeService],
})
export class BookingsModule {}
