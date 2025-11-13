import api from '@/lib/api';

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

export const analyticsService = {
  async getDashboardMetrics(period: 'day' | 'week' | 'month' = 'month'): Promise<DashboardMetrics> {
    const { data } = await api.get<DashboardMetrics>('/analytics/dashboard', {
      params: { period },
    });
    return data;
  },

  async getRevenueReport(startDate: Date, endDate: Date): Promise<any> {
    const { data } = await api.get('/analytics/revenue-report', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return data;
  },

  async getClientsReport(): Promise<any> {
    const { data } = await api.get('/analytics/clients-report');
    return data;
  },

  async getPerformanceReport(year: number, month?: number): Promise<any> {
    const { data } = await api.get('/analytics/performance-report', {
      params: { year, month },
    });
    return data;
  },
};
