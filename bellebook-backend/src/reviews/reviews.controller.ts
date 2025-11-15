import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('featured')
  async getFeaturedReviews(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.reviewsService.findFeatured(limitNum);
  }

  @Get('service/:serviceId')
  async getServiceReviews(@Param('serviceId') serviceId: string) {
    return this.reviewsService.findByService(serviceId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyReviews(@Request() req) {
    return this.reviewsService.findByUser(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() data: Omit<CreateReviewDto, 'userId'>,
    @Request() req,
  ) {
    return this.reviewsService.create({
      ...data,
      userId: req.user.id,
    });
  }
}
