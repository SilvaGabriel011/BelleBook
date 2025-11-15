import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AdminBookingsService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getAllBookings(filters?: {
    status?: string;
    serviceId?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.serviceId) where.serviceId = filters.serviceId;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              displayName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          service: true,
        },
        orderBy: { date: 'desc' },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      total,
      page: Math.floor((filters?.skip || 0) / (filters?.take || 50)) + 1,
      pageSize: filters?.take || 50,
    };
  }

  async getBookingDetails(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        service: true,
        review: true,
        reminders: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return booking;
  }

  async cancelBooking(
    bookingId: string,
    adminId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    await this.auditLog.log({
      adminId,
      action: 'CANCEL_BOOKING',
      resource: 'Booking',
      resourceId: bookingId,
      changes: { reason, previousStatus: booking.status },
      ipAddress,
      userAgent,
    });

    return { message: 'Agendamento cancelado com sucesso' };
  }

  async updateBookingStatus(
    bookingId: string,
    status: string,
    adminId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    await this.auditLog.log({
      adminId,
      action: 'UPDATE_BOOKING_STATUS',
      resource: 'Booking',
      resourceId: bookingId,
      changes: { newStatus: status, previousStatus: booking.status },
      ipAddress,
      userAgent,
    });

    return { message: 'Status atualizado com sucesso' };
  }

  async getBookingsForCalendar(startDate: Date, endDate: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            displayName: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.service.name} - ${booking.user.displayName || booking.user.name}`,
      start: booking.date,
      status: booking.status,
      userId: booking.userId,
      serviceId: booking.serviceId,
    }));
  }

  async getBookingStats() {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }
}
