import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DashboardMetrics {
  totalBookings: number;
  totalRevenue: number;
  newClients: number;
  completedServices: number;
  cancelledBookings: number;
  averageRating: number;
  topServices: ServiceMetric[];
  revenueByDay: RevenueByDay[];
  bookingsByStatus: BookingStatus[];
  upcomingBookings: any[];
  recentReviews: any[];
}

export interface ServiceMetric {
  id: string;
  name: string;
  category: string;
  count: number;
  revenue: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  bookings: number;
}

export interface BookingStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Obter métricas do dashboard
  async getDashboardMetrics(period: 'day' | 'week' | 'month' = 'month'): Promise<DashboardMetrics> {
    const timeRange = this.getTimeRange(period);

    // Métricas básicas
    const [
      totalBookings,
      totalRevenue,
      newClients,
      completedServices,
      cancelledBookings,
      averageRating,
      topServices,
      revenueByDay,
      bookingsByStatus,
      upcomingBookings,
      recentReviews
    ] = await Promise.all([
      this.getTotalBookings(timeRange),
      this.getTotalRevenue(timeRange),
      this.getNewClients(timeRange),
      this.getCompletedServices(timeRange),
      this.getCancelledBookings(timeRange),
      this.getAverageRating(),
      this.getTopServices(timeRange, 5),
      this.getRevenueByDay(timeRange),
      this.getBookingsByStatus(timeRange),
      this.getUpcomingBookings(5),
      this.getRecentReviews(5)
    ]);

    return {
      totalBookings,
      totalRevenue,
      newClients,
      completedServices,
      cancelledBookings,
      averageRating,
      topServices,
      revenueByDay,
      bookingsByStatus,
      upcomingBookings,
      recentReviews
    };
  }

  // Obter período de tempo
  private getTimeRange(period: 'day' | 'week' | 'month'): TimeRange {
    const now = new Date();
    let start: Date;
    let end: Date = endOfDay(now);

    switch (period) {
      case 'day':
        start = startOfDay(now);
        break;
      case 'week':
        start = startOfWeek(now, { locale: ptBR });
        end = endOfWeek(now, { locale: ptBR });
        break;
      case 'month':
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    return { start, end };
  }

  // Total de agendamentos
  private async getTotalBookings(timeRange: TimeRange): Promise<number> {
    return this.prisma.booking.count({
      where: {
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });
  }

  // Receita total
  private async getTotalRevenue(timeRange: TimeRange): Promise<number> {
    const result = await this.prisma.booking.aggregate({
      _sum: {
        totalPaid: true
      },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });

    return result._sum.totalPaid?.toNumber() || 0;
  }

  // Novos clientes
  private async getNewClients(timeRange: TimeRange): Promise<number> {
    return this.prisma.user.count({
      where: {
        role: 'CLIENT',
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });
  }

  // Serviços completados
  private async getCompletedServices(timeRange: TimeRange): Promise<number> {
    return this.prisma.booking.count({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });
  }

  // Agendamentos cancelados
  private async getCancelledBookings(timeRange: TimeRange): Promise<number> {
    return this.prisma.booking.count({
      where: {
        status: 'CANCELLED',
        updatedAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });
  }

  // Avaliação média
  private async getAverageRating(): Promise<number> {
    const result = await this.prisma.review.aggregate({
      _avg: {
        rating: true
      }
    });

    return result._avg.rating || 0;
  }

  // Top serviços mais agendados
  private async getTopServices(timeRange: TimeRange, limit: number): Promise<ServiceMetric[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    // Agrupar por serviço
    const serviceMap = new Map<string, ServiceMetric>();

    bookings.forEach(booking => {
      if (!booking.service) return;

      const key = booking.service.id;
      const existing = serviceMap.get(key);

      if (existing) {
        existing.count++;
        existing.revenue += booking.totalPaid.toNumber();
      } else {
        serviceMap.set(key, {
          id: booking.service.id,
          name: booking.service.name,
          category: booking.service.category?.name || '',
          count: 1,
          revenue: booking.totalPaid.toNumber()
        });
      }
    });

    // Converter para array e ordenar
    return Array.from(serviceMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Receita por dia
  private async getRevenueByDay(timeRange: TimeRange): Promise<RevenueByDay[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        date: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      },
      select: {
        date: true,
        totalPaid: true
      }
    });

    // Agrupar por data
    const revenueMap = new Map<string, RevenueByDay>();

    bookings.forEach(booking => {
      const dateKey = format(booking.date, 'yyyy-MM-dd');
      const existing = revenueMap.get(dateKey);

      if (existing) {
        existing.revenue += booking.totalPaid.toNumber();
        existing.bookings++;
      } else {
        revenueMap.set(dateKey, {
          date: dateKey,
          revenue: booking.totalPaid.toNumber(),
          bookings: 1
        });
      }
    });

    // Converter para array e ordenar por data
    return Array.from(revenueMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Agendamentos por status
  private async getBookingsByStatus(timeRange: TimeRange): Promise<BookingStatus[]> {
    const bookings = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where: {
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      }
    });

    const total = bookings.reduce((sum, b) => sum + b._count.status, 0);

    return bookings.map(b => ({
      status: b.status,
      count: b._count.status,
      percentage: total > 0 ? (b._count.status / total) * 100 : 0
    }));
  }

  // Próximos agendamentos
  private async getUpcomingBookings(limit: number): Promise<any[]> {
    const now = new Date();
    
    return this.prisma.booking.findMany({
      where: {
        date: {
          gte: now
        },
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      include: {
        service: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      take: limit
    });
  }

  // Avaliações recentes
  private async getRecentReviews(limit: number): Promise<any[]> {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        service: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  // Relatório de faturamento
  async getRevenueReport(startDate: Date, endDate: Date): Promise<any> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        status: 'COMPLETED',
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    // Calcular totais
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPaid.toNumber(), 0);
    const totalBookings = bookings.length;

    // Agrupar por categoria
    const byCategory = new Map<string, number>();
    bookings.forEach(booking => {
      const category = booking.service?.category?.name || 'Outros';
      const current = byCategory.get(category) || 0;
      byCategory.set(category, current + booking.totalPaid.toNumber());
    });

    // Agrupar por mês
    const byMonth = new Map<string, number>();
    bookings.forEach(booking => {
      const month = format(booking.date, 'yyyy-MM');
      const current = byMonth.get(month) || 0;
      byMonth.set(month, current + booking.totalPaid.toNumber());
    });

    return {
      period: {
        start: startDate,
        end: endDate
      },
      summary: {
        totalRevenue,
        totalBookings,
        averageTicket: totalBookings > 0 ? totalRevenue / totalBookings : 0
      },
      byCategory: Array.from(byCategory.entries()).map(([category, revenue]) => ({
        category,
        revenue,
        percentage: (revenue / totalRevenue) * 100
      })),
      byMonth: Array.from(byMonth.entries()).map(([month, revenue]) => ({
        month,
        revenue
      }))
    };
  }

  // Relatório de clientes
  async getClientsReport(): Promise<any> {
    const [totalClients, activeClients, topClients] = await Promise.all([
      // Total de clientes
      this.prisma.user.count({
        where: { role: 'CLIENT' }
      }),

      // Clientes ativos (com agendamentos nos últimos 30 dias)
      this.prisma.user.count({
        where: {
          role: 'CLIENT',
          bookings: {
            some: {
              createdAt: {
                gte: subDays(new Date(), 30)
              }
            }
          }
        }
      }),

      // Top clientes (por número de agendamentos)
      this.prisma.user.findMany({
        where: { role: 'CLIENT' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Taxa de retenção
    const retentionRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

    return {
      totalClients,
      activeClients,
      retentionRate,
      topClients: topClients.map(client => ({
        ...client,
        totalBookings: client._count.bookings
      }))
    };
  }

  // Relatório de desempenho por período
  async getPerformanceReport(year: number, month?: number): Promise<any> {
    const startDate = month 
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    
    const endDate = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    const [bookings, reviews, newClients] = await Promise.all([
      // Agendamentos
      this.prisma.booking.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          service: true
        }
      }),

      // Avaliações
      this.prisma.review.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),

      // Novos clientes
      this.prisma.user.count({
        where: {
          role: 'CLIENT',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    ]);

    // Calcular métricas
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPaid.toNumber(), 0);
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Taxa de conclusão
    const completionRate = bookings.length > 0 
      ? (completedBookings.length / bookings.length) * 100
      : 0;

    // Taxa de cancelamento
    const cancellationRate = bookings.length > 0
      ? (cancelledBookings.length / bookings.length) * 100
      : 0;

    return {
      period: {
        year,
        month: month || null
      },
      bookings: {
        total: bookings.length,
        completed: completedBookings.length,
        cancelled: cancelledBookings.length,
        completionRate,
        cancellationRate
      },
      financial: {
        totalRevenue,
        averageTicket: completedBookings.length > 0 
          ? totalRevenue / completedBookings.length
          : 0
      },
      clients: {
        newClients,
        returningClients: bookings.filter(b => {
          // Contar clientes recorrentes (implementar lógica específica)
          return true;
        }).length
      },
      satisfaction: {
        totalReviews: reviews.length,
        averageRating,
        distribution: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length
        }
      }
    };
  }
}
