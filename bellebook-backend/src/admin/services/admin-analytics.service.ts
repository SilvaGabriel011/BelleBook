import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverviewKPIs() {
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    const twoMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate(),
    );

    // Total active users
    const [totalActiveUsers, lastMonthUsers, twoMonthsAgoUsers] =
      await Promise.all([
        this.prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
        this.prisma.user.count({
          where: { accountStatus: 'ACTIVE', createdAt: { gte: lastMonth } },
        }),
        this.prisma.user.count({
          where: {
            accountStatus: 'ACTIVE',
            createdAt: { gte: twoMonthsAgo, lt: lastMonth },
          },
        }),
      ]);

    const usersChange =
      twoMonthsAgoUsers > 0
        ? ((lastMonthUsers - twoMonthsAgoUsers) / twoMonthsAgoUsers) * 100
        : 0;

    // Bookings today
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
    );

    const [bookingsToday, bookingsYesterday] = await Promise.all([
      this.prisma.booking.count({
        where: { date: { gte: startOfDay, lt: endOfDay } },
      }),
      this.prisma.booking.count({
        where: { date: { gte: yesterday, lt: startOfDay } },
      }),
    ]);

    const bookingsChange =
      bookingsYesterday > 0
        ? ((bookingsToday - bookingsYesterday) / bookingsYesterday) * 100
        : 0;

    // Revenue this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
      this.prisma.booking.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: 'PAID',
        },
        _sum: { totalPaid: true },
      }),
      this.prisma.booking.aggregate({
        where: {
          createdAt: { gte: startOfLastMonth, lt: startOfMonth },
          paymentStatus: 'PAID',
        },
        _sum: { totalPaid: true },
      }),
    ]);

    const revenueChange = lastMonthRevenue._sum.totalPaid
      ? ((Number(thisMonthRevenue._sum.totalPaid || 0) -
          Number(lastMonthRevenue._sum.totalPaid)) /
          Number(lastMonthRevenue._sum.totalPaid)) *
        100
      : 0;

    // Pending role requests
    const pendingRequests = await this.prisma.roleRequest.count({
      where: { status: 'PENDING' },
    });

    return {
      activeUsers: {
        value: totalActiveUsers,
        change: Number(usersChange.toFixed(1)),
        trend: usersChange >= 0 ? 'up' : 'down',
      },
      bookingsToday: {
        value: bookingsToday,
        change: Number(bookingsChange.toFixed(1)),
        trend: bookingsChange >= 0 ? 'up' : 'down',
      },
      monthlyRevenue: {
        value: Number(thisMonthRevenue._sum.totalPaid || 0),
        change: Number(revenueChange.toFixed(1)),
        trend: revenueChange >= 0 ? 'up' : 'down',
      },
      pendingRequests: {
        value: pendingRequests,
        change: 0,
        trend: 'up',
      },
    };
  }

  async getBookingsChart(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by date
    const groupedByDate = bookings.reduce(
      (acc: Record<string, number>, booking) => {
        const date = booking.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(groupedByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getServicesDistribution() {
    const services = await this.prisma.booking.groupBy({
      by: ['serviceId'],
      _count: true,
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 10,
    });

    const serviceDetails = await this.prisma.service.findMany({
      where: {
        id: { in: services.map((s) => s.serviceId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return services.map((service) => {
      const details = serviceDetails.find((s) => s.id === service.serviceId);
      return {
        name: details?.name || 'Unknown',
        count: service._count,
      };
    });
  }

  async getConversionRate(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalUsers, bookingsCount] = await Promise.all([
      this.prisma.user.count({
        where: {
          role: 'CUSTOMER',
          createdAt: { gte: startDate },
        },
      }),
      this.prisma.booking.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
    ]);

    const conversionRate =
      totalUsers > 0 ? (bookingsCount / totalUsers) * 100 : 0;

    return {
      totalUsers,
      bookingsCount,
      conversionRate: Number(conversionRate.toFixed(2)),
    };
  }

  async getEmployeePerformance() {
    const employees = await this.prisma.employeeProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return employees.map((employee) => ({
      id: employee.userId,
      name: employee.user.displayName || employee.user.name,
      avatar: employee.user.avatar,
      rating: employee.rating,
      totalServices: employee.totalServices,
      isAvailable: employee.isAvailable,
    }));
  }

  async getRevenueByService(startDate: Date, endDate: Date) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: 'PAID',
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const revenueByService = bookings.reduce(
      (acc: Record<string, { name: string; revenue: number }>, booking) => {
        const serviceId = booking.service.id;
        const serviceName = booking.service.name;

        if (!acc[serviceId]) {
          acc[serviceId] = { name: serviceName, revenue: 0 };
        }

        acc[serviceId].revenue += Number(booking.totalPaid);
        return acc;
      },
      {},
    );

    return Object.values(revenueByService).sort(
      (a, b) => b.revenue - a.revenue,
    );
  }

  async getCancellationRate(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalBookings, cancelledBookings] = await Promise.all([
      this.prisma.booking.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.booking.count({
        where: {
          createdAt: { gte: startDate },
          status: 'CANCELLED',
        },
      }),
    ]);

    const cancellationRate =
      totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;

    return {
      totalBookings,
      cancelledBookings,
      cancellationRate: Number(cancellationRate.toFixed(2)),
    };
  }
}
