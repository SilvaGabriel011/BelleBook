import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { SendGridService } from './services/sendgrid.service';
import { TemplateService } from './services/template.service';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'email',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
      },
    }),
  ],
  providers: [
    NotificationsService,
    SendGridService,
    TemplateService,
    EmailProcessor,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
