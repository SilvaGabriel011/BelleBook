import { Module } from '@nestjs/common';
import { ServiceAttributesController } from './service-attributes.controller';
import { ServiceAttributesService } from './service-attributes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceAttributesController],
  providers: [ServiceAttributesService],
  exports: [ServiceAttributesService],
})
export class ServiceAttributesModule {}
