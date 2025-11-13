import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { CreateBookingDto } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('slots')
  async getAvailableSlots(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailableSlots(serviceId, date);
  }

  @Post()
  async createBooking(@Body() data: CreateBookingDto, @Request() req) {
    return this.bookingsService.createBooking({
      ...data,
      userId: req.user.id,
    });
  }

  @Get('my')
  async getMyBookings(@Request() req) {
    return this.bookingsService.getUserBookings(req.user.id);
  }

  @Get('next')
  async getNextBooking(@Request() req) {
    return this.bookingsService.getNextBooking(req.user.id);
  }

  @Delete(':id')
  async cancelBooking(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancelBooking(id, req.user.id);
  }

  @Put(':id/reschedule')
  async rescheduleBooking(
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @Request() req,
  ) {
    return this.bookingsService.rescheduleBooking(id, req.user.id, date, time);
  }
}
