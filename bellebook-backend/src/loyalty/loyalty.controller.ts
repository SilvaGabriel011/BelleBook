import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('rewards')
  async getRewards() {
    return this.loyaltyService.getRewards();
  }

  @Get('points')
  async getUserPoints(@Request() req) {
    return this.loyaltyService.getUserPoints(req.user.id);
  }

  @Post('redeem')
  async redeemReward(@Body('rewardId') rewardId: string, @Request() req) {
    return this.loyaltyService.redeemReward(req.user.id, rewardId);
  }
}
