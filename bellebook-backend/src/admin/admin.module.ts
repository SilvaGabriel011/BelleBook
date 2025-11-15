import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAnalyticsService } from './services/admin-analytics.service';
import { AdminUsersService } from './services/admin-users.service';
import { AdminBookingsService } from './services/admin-bookings.service';
import { AuditLogService } from './services/audit-log.service';
import { AdminChatService } from './services/admin-chat.service';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminBookingsController } from './controllers/admin-bookings.controller';
import { AdminChatController } from './controllers/admin-chat.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    AdminAnalyticsService,
    AdminUsersService,
    AdminBookingsService,
    AuditLogService,
    AdminChatService,
  ],
  controllers: [
    AdminAnalyticsController,
    AdminUsersController,
    AdminBookingsController,
    AdminChatController,
  ],
  exports: [AuditLogService],
})
export class AdminModule {}
