import axios from 'axios';
import type {
  DailySummary,
  NextBooking,
  ClientCard,
  ClientDetails,
  EmployeePerformance,
  Review,
  BlockTimeRequest,
} from '@/types/employee';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const employeeApi = {
  // Dashboard
  getDailySummary: async (): Promise<DailySummary> => {
    const { data } = await api.get('/employee/dashboard/summary');
    return data;
  },

  getNextBookings: async (limit = 5): Promise<NextBooking[]> => {
    const { data } = await api.get('/employee/bookings/next', {
      params: { limit },
    });
    return data;
  },

  // Clients
  getClients: async (options?: {
    search?: string;
    orderBy?: 'lastBooking' | 'totalBookings' | 'name';
    filter?: 'active' | 'inactive' | 'all';
  }): Promise<ClientCard[]> => {
    const { data } = await api.get('/employee/clients', {
      params: options,
    });
    return data;
  },

  getClientDetails: async (clientId: string): Promise<ClientDetails> => {
    const { data } = await api.get(`/employee/clients/${clientId}`);
    return data;
  },

  // Performance
  getPerformance: async (
    period: 'week' | 'month' | '3months' | 'year' = 'month',
  ): Promise<EmployeePerformance> => {
    const { data } = await api.get('/employee/performance', {
      params: { period },
    });
    return data;
  },

  // Availability
  updateAvailability: async (isAvailable: boolean): Promise<void> => {
    await api.put('/employee/availability', { isAvailable });
  },

  // Reviews
  getLatestReviews: async (limit = 3): Promise<Review[]> => {
    const { data } = await api.get('/employee/reviews/latest', {
      params: { limit },
    });
    return data;
  },

  // Schedule
  blockTime: async (blockData: BlockTimeRequest): Promise<void> => {
    await api.post('/employee/schedule/block', blockData);
  },
};
