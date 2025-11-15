import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { BlockTimeDto } from './dto/block-time.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('dashboard/summary')
  async getDailySummary(@Request() req) {
    const employeeId = req.user.userId;
    return this.employeeService.getDailySummary(employeeId);
  }

  @Get('bookings/next')
  async getNextBookings(@Request() req, @Query('limit') limit?: string) {
    const employeeId = req.user.userId;
    return this.employeeService.getNextBookings(
      employeeId,
      limit ? parseInt(limit) : 5,
    );
  }

  @Get('clients')
  async getClients(
    @Request() req,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: 'lastBooking' | 'totalBookings' | 'name',
    @Query('filter') filter?: 'active' | 'inactive' | 'all',
  ) {
    const employeeId = req.user.userId;
    return this.employeeService.getClients(employeeId, {
      search,
      orderBy,
      filter,
    });
  }

  @Get('clients/:id')
  async getClientDetails(@Request() req, @Param('id') clientId: string) {
    const employeeId = req.user.userId;
    return this.employeeService.getClientDetails(employeeId, clientId);
  }

  @Get('performance')
  async getPerformance(
    @Request() req,
    @Query('period') period: 'week' | 'month' | '3months' | 'year' = 'month',
  ) {
    const employeeId = req.user.userId;
    return this.employeeService.getPerformance(employeeId, period);
  }

  @Put('availability')
  async updateAvailability(
    @Request() req,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    const employeeId = req.user.userId;
    await this.employeeService.updateAvailability(employeeId, isAvailable);
    return { success: true };
  }

  @Get('reviews/latest')
  async getLatestReviews(@Request() req, @Query('limit') limit?: string) {
    const employeeId = req.user.userId;
    return this.employeeService.getLatestReviews(
      employeeId,
      limit ? parseInt(limit) : 3,
    );
  }

  @Post('schedule/block')
  async blockTime(@Request() _req, @Body() _blockTimeDto: BlockTimeDto) {
    // Implement block time logic
    return { success: true, message: 'Time blocked successfully' };
  }
}
