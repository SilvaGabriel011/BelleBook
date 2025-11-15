import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleRequestService } from './role-request.service';
import { RoleRequestController } from './role-request.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [RoleRequestController],
  providers: [UsersService, RoleRequestService],
  exports: [UsersService, RoleRequestService],
})
export class UsersModule {}
