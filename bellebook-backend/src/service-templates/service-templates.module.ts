import { Module } from '@nestjs/common';
import { ServiceTemplatesController } from './service-templates.controller';
import { ServiceTemplatesService } from './service-templates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceTemplatesController],
  providers: [ServiceTemplatesService],
  exports: [ServiceTemplatesService],
})
export class ServiceTemplatesModule {}
