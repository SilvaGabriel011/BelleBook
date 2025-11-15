import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminBookingsService } from '../services/admin-bookings.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminBookingsController {
  constructor(private bookingsService: AdminBookingsService) {}

  @Get()
  async getAllBookings(@Query() filters: any) {
    return this.bookingsService.getAllBookings(filters);
  }

  @Get('stats')
  async getBookingStats() {
    return this.bookingsService.getBookingStats();
  }

  @Get('calendar')
  async getBookingsForCalendar(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.bookingsService.getBookingsForCalendar(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  async getBookingDetails(@Param('id') id: string) {
    return this.bookingsService.getBookingDetails(id);
  }

  @Patch(':id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Req() req: any,
  ) {
    return this.bookingsService.cancelBooking(
      id,
      req.user.id,
      body.reason,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @Patch(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() req: any,
  ) {
    return this.bookingsService.updateBookingStatus(
      id,
      body.status,
      req.user.id,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
