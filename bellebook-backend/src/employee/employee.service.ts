import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailySummaryDto, EmployeePerformanceDto, ServiceStatsDto, ClientStatsDto } from './dto/employee-stats.dto';
import { NextBookingDto } from './dto/next-booking.dto';
import { ClientCardDto, ClientDetailsDto } from './dto/client.dto';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getDailySummary(employeeId: string): Promise<DailySummaryDto> {
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);

    // Get all bookings for today
    const bookingsToday = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: startDay,
          lte: endDay,
        },
        // Note: In a real implementation, you'd filter by employee assignment
        // For now, we're assuming userId in booking refers to customer
      },
      include: {
        service: true,
      },
    });

    const completedToday = bookingsToday.filter(b => b.status === 'COMPLETED').length;
    const totalBookings = bookingsToday.length;
    const remainingToday = totalBookings - completedToday;

    const estimatedRevenue = bookingsToday.reduce((sum, b) => {
      return sum + Number(b.totalPaid);
    }, 0);

    // Get average rating
    const employeeProfile = await this.prisma.employeeProfile.findUnique({
      where: { userId: employeeId },
    });

    return {
      totalBookings,
      completedToday,
      remainingToday,
      estimatedRevenue,
      averageRating: employeeProfile?.rating || 0,
    };
  }

  async getNextBookings(employeeId: string, limit: number = 5): Promise<NextBookingDto[]> {
    const now = new Date();

    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: now,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      take: limit,
      orderBy: {
        date: 'asc',
      },
      include: {
        user: true,
        service: true,
      },
    });

    return bookings.map(booking => ({
      id: booking.id,
      customer: {
        id: booking.user.id,
        name: booking.user.name,
        avatar: booking.user.avatar,
        phone: booking.user.phone,
      },
      service: {
        id: booking.service.id,
        name: booking.service.name,
        duration: booking.service.duration,
      },
      scheduledAt: booking.date,
      status: booking.status,
      notes: booking.notes,
    }));
  }

  async getClients(
    employeeId: string,
    options: {
      search?: string;
      orderBy?: 'lastBooking' | 'totalBookings' | 'name';
      filter?: 'active' | 'inactive' | 'all';
    } = {},
  ): Promise<ClientCardDto[]> {
    const { search, orderBy = 'lastBooking', filter = 'all' } = options;

    // Get all bookings to find unique customers
    const bookings = await this.prisma.booking.findMany({
      include: {
        user: true,
        service: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Group by user
    const clientsMap = new Map<string, any>();

    for (const booking of bookings) {
      const userId = booking.user.id;
      
      if (!clientsMap.has(userId)) {
        clientsMap.set(userId, {
          id: userId,
          name: booking.user.name,
          avatar: booking.user.avatar,
          phone: booking.user.phone,
          email: booking.user.email,
          bookings: [],
          services: [],
        });
      }

      const client = clientsMap.get(userId);
      client.bookings.push(booking);
      if (!client.services.includes(booking.service.name)) {
        client.services.push(booking.service.name);
      }
    }

    // Transform to ClientCardDto
    const clients: ClientCardDto[] = Array.from(clientsMap.values()).map(client => {
      const totalSpent = client.bookings.reduce((sum: number, b: any) => sum + Number(b.totalPaid), 0);
      const lastBooking = client.bookings[0]?.date || null;
      
      return {
        id: client.id,
        name: client.name,
        avatar: client.avatar,
        phone: client.phone,
        email: client.email,
        totalBookings: client.bookings.length,
        lastBooking,
        favoriteServices: client.services.slice(0, 3),
        averageFrequency: null, // Would calculate from booking dates
        totalSpent,
      };
    });

    // Apply filters
    let filtered = clients;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchLower) || 
        c.email.toLowerCase().includes(searchLower) ||
        c.phone?.toLowerCase().includes(searchLower)
      );
    }

    if (filter === 'inactive') {
      const threeMonthsAgo = subMonths(new Date(), 3);
      filtered = filtered.filter(c => c.lastBooking && c.lastBooking < threeMonthsAgo);
    } else if (filter === 'active') {
      const threeMonthsAgo = subMonths(new Date(), 3);
      filtered = filtered.filter(c => c.lastBooking && c.lastBooking >= threeMonthsAgo);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (orderBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (orderBy === 'totalBookings') {
        return b.totalBookings - a.totalBookings;
      } else { // lastBooking
        if (!a.lastBooking) return 1;
        if (!b.lastBooking) return -1;
        return b.lastBooking.getTime() - a.lastBooking.getTime();
      }
    });

    return filtered;
  }

  async getClientDetails(employeeId: string, clientId: string): Promise<ClientDetailsDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: clientId },
      include: {
        bookings: {
          include: {
            service: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Client not found');
    }

    const now = new Date();
    const pastBookings = user.bookings.filter(b => b.date < now);
    const upcomingBookings = user.bookings.filter(b => b.date >= now);

    const totalSpent = user.bookings.reduce((sum, b) => sum + Number(b.totalPaid), 0);
    const services = [...new Set(user.bookings.map(b => b.service.name))];

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      phone: user.phone,
      email: user.email,
      totalBookings: user.bookings.length,
      lastBooking: pastBookings[0]?.date || null,
      favoriteServices: services.slice(0, 3),
      averageFrequency: null,
      totalSpent,
      bookingHistory: pastBookings.map(b => ({
        id: b.id,
        serviceName: b.service.name,
        date: b.date,
        status: b.status,
        totalPaid: Number(b.totalPaid),
      })),
      upcomingBookings: upcomingBookings.map(b => ({
        id: b.id,
        serviceName: b.service.name,
        scheduledAt: b.date,
        status: b.status,
      })),
    };
  }

  async getPerformance(
    employeeId: string,
    period: 'week' | 'month' | '3months' | 'year',
  ): Promise<EmployeePerformanceDto> {
    let startDate: Date;
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate = startOfWeek(endDate);
        break;
      case 'month':
        startDate = startOfMonth(endDate);
        break;
      case '3months':
        startDate = subMonths(endDate, 3);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
        review: true,
      },
    });

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + Number(b.totalPaid), 0);
    
    const averageTicket = completedBookings > 0 ? totalRevenue / completedBookings : 0;
    
    const reviews = bookings.filter(b => b.review).map(b => b.review!);
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Service stats
    const serviceMap = new Map<string, { count: number; revenue: number; name: string }>();
    for (const booking of bookings.filter(b => b.status === 'COMPLETED')) {
      const existing = serviceMap.get(booking.serviceId) || {
        count: 0,
        revenue: 0,
        name: booking.service.name,
      };
      existing.count++;
      existing.revenue += Number(booking.totalPaid);
      serviceMap.set(booking.serviceId, existing);
    }

    const serviceStats: ServiceStatsDto[] = Array.from(serviceMap.entries())
      .map(([serviceId, data]) => ({
        serviceId,
        serviceName: data.name,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue by date (simplified - group by day)
    const revenueByDate = bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((acc, b) => {
        const dateStr = b.date.toISOString().split('T')[0];
        acc[dateStr] = (acc[dateStr] || 0) + Number(b.totalPaid);
        return acc;
      }, {} as Record<string, number>);

    // Client stats
    const uniqueClients = new Set(bookings.map(b => b.userId));
    const clientStats: ClientStatsDto = {
      newClients: 0, // Would need to track first booking
      recurringClients: 0,
      retentionRate: 0,
      topClients: [],
    };

    return {
      overview: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        noShowRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0,
        totalRevenue,
        averageTicket,
        averageRating,
        totalReviews: reviews.length,
      },
      serviceStats,
      clientStats,
      revenueByDate: Object.entries(revenueByDate).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      bookingsByHour: [], // Would need time data
    };
  }

  async updateAvailability(employeeId: string, isAvailable: boolean): Promise<void> {
    await this.prisma.employeeProfile.update({
      where: { userId: employeeId },
      data: { isAvailable },
    });
  }

  async getLatestReviews(employeeId: string, limit: number = 3) {
    // In a real implementation, you'd filter by employee
    const reviews = await this.prisma.review.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        service: true,
      },
    });

    return reviews.map(review => ({
      id: review.id,
      customer: {
        name: review.user.name,
        avatar: review.user.avatar,
      },
      service: review.service.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
  }
}
