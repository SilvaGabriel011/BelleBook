import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import * as PromotionDtos from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('active')
  async getActiveBanners() {
    return this.promotionsService.findActive();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllBanners() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getBannerById(@Param('id') id: string) {
    return this.promotionsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createBanner(@Body() data: PromotionDtos.CreatePromoBannerDto) {
    return this.promotionsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateBanner(@Param('id') id: string, @Body() data: PromotionDtos.UpdatePromoBannerDto) {
    return this.promotionsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteBanner(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleActive(@Param('id') id: string) {
    return this.promotionsService.toggleActive(id);
  }
}
