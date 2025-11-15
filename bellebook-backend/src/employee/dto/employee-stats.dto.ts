export class DailySummaryDto {
  totalBookings: number;
  completedToday: number;
  remainingToday: number;
  estimatedRevenue: number;
  averageRating: number;
}

export class PerformanceOverviewDto {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowRate: number;
  totalRevenue: number;
  averageTicket: number;
  averageRating: number;
  totalReviews: number;
}

export class ServiceStatsDto {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

export class ClientStatsDto {
  newClients: number;
  recurringClients: number;
  retentionRate: number;
  topClients: Array<{
    userId: string;
    name: string;
    totalSpent: number;
    bookingCount: number;
  }>;
}

export class EmployeePerformanceDto {
  overview: PerformanceOverviewDto;
  serviceStats: ServiceStatsDto[];
  clientStats: ClientStatsDto;
  revenueByDate: Array<{
    date: string;
    revenue: number;
  }>;
  bookingsByHour: Array<{
    hour: number;
    count: number;
  }>;
}
