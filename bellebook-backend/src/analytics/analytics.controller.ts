import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Verificar se é admin/provider
  private checkAdminAccess(user: any) {
    if (user.role !== 'ADMIN' && user.role !== 'PROVIDER') {
      throw new ForbiddenException('Acesso negado. Apenas administradores.');
    }
  }

  @Get('dashboard')
  async getDashboard(
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
    @Request() req,
  ) {
    this.checkAdminAccess(req.user);
    return this.analyticsService.getDashboardMetrics(period);
  }

  @Get('revenue-report')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    this.checkAdminAccess(req.user);
    return this.analyticsService.getRevenueReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('clients-report')
  async getClientsReport(@Request() req) {
    this.checkAdminAccess(req.user);
    return this.analyticsService.getClientsReport();
  }

  @Get('performance-report')
  async getPerformanceReport(
    @Request() req,
    @Query('year') year: string,
    @Query('month') month?: string,
  ) {
    this.checkAdminAccess(req.user);
    return this.analyticsService.getPerformanceReport(
      parseInt(year),
      month ? parseInt(month) : undefined,
    );
  }
}
