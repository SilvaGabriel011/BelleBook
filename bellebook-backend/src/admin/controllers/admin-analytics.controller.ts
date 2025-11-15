import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminAnalyticsController {
  constructor(private analyticsService: AdminAnalyticsService) {}

  @Get('overview')
  async getOverview() {
    return this.analyticsService.getOverviewKPIs();
  }

  @Get('bookings-chart')
  async getBookingsChart(@Query('days') days?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getBookingsChart(numDays);
  }

  @Get('services-distribution')
  async getServicesDistribution() {
    return this.analyticsService.getServicesDistribution();
  }

  @Get('conversion-rate')
  async getConversionRate(@Query('days') days?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getConversionRate(numDays);
  }

  @Get('employee-performance')
  async getEmployeePerformance() {
    return this.analyticsService.getEmployeePerformance();
  }

  @Get('revenue-by-service')
  async getRevenueByService(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.analyticsService.getRevenueByService(start, end);
  }

  @Get('cancellation-rate')
  async getCancellationRate(@Query('days') days?: string) {
    const numDays = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getCancellationRate(numDays);
  }
}
