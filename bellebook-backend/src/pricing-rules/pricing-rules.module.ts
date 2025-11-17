import { Module } from '@nestjs/common';
import { PricingRulesController } from './pricing-rules.controller';
import { PricingRulesService } from './pricing-rules.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PricingRulesController],
  providers: [PricingRulesService],
  exports: [PricingRulesService],
})
export class PricingRulesModule {}
