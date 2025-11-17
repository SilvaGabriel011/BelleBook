import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import type { CreatePricingRuleDto, UpdatePricingRuleDto } from './pricing-rules.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('pricing-rules')
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(@Query('serviceId') serviceId?: string) {
    return this.pricingRulesService.findAll(serviceId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.pricingRulesService.findById(id);
  }

  @Get('service/:serviceId')
  async findByServiceId(@Param('serviceId') serviceId: string) {
    return this.pricingRulesService.findByServiceId(serviceId);
  }

  @Post('calculate-price/:serviceId')
  async calculatePrice(
    @Param('serviceId') serviceId: string,
    @Body() context: Record<string, any>,
  ) {
    const price = await this.pricingRulesService.calculatePrice(serviceId, context);
    return { price };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createDto: CreatePricingRuleDto) {
    return this.pricingRulesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateDto: UpdatePricingRuleDto) {
    return this.pricingRulesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.pricingRulesService.remove(id);
  }
}
