// Employee Dashboard Types

export interface DailySummary {
  totalBookings: number;
  completedToday: number;
  remainingToday: number;
  estimatedRevenue: number;
  averageRating: number;
}

export interface NextBooking {
  id: string;
  customer: {
    id: string;
    name: string;
    avatar: string | null;
    phone: string | null;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
  scheduledAt: Date | string;
  status: string;
  notes: string | null;
}

export interface ClientCard {
  id: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string;
  totalBookings: number;
  lastBooking: Date | string | null;
  favoriteServices: string[];
  averageFrequency: string | null;
  totalSpent: number;
  notes?: string;
}

export interface ClientDetails extends ClientCard {
  bookingHistory: Array<{
    id: string;
    serviceName: string;
    date: Date | string;
    status: string;
    totalPaid: number;
  }>;
  upcomingBookings: Array<{
    id: string;
    serviceName: string;
    scheduledAt: Date | string;
    status: string;
  }>;
}

export interface PerformanceOverview {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowRate: number;
  totalRevenue: number;
  averageTicket: number;
  averageRating: number;
  totalReviews: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

export interface ClientStats {
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

export interface EmployeePerformance {
  overview: PerformanceOverview;
  serviceStats: ServiceStats[];
  clientStats: ClientStats;
  revenueByDate: Array<{
    date: string;
    revenue: number;
  }>;
  bookingsByHour: Array<{
    hour: number;
    count: number;
  }>;
}

export interface Review {
  id: string;
  customer: {
    name: string;
    avatar: string | null;
  };
  service: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
}

export interface BlockTimeRequest {
  startTime: string;
  endTime: string;
  reason: string;
  recurring?: {
    frequency: 'daily' | 'weekly';
    until: string;
  };
}
