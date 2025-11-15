import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const adminApi = {
  // Analytics
  analytics: {
    getOverview: () => api.get('/admin/analytics/overview'),
    getBookingsChart: (days = 30) => api.get(`/admin/analytics/bookings-chart?days=${days}`),
    getServicesDistribution: () => api.get('/admin/analytics/services-distribution'),
    getConversionRate: (days = 30) => api.get(`/admin/analytics/conversion-rate?days=${days}`),
    getEmployeePerformance: () => api.get('/admin/analytics/employee-performance'),
    getRevenueByService: (startDate: string, endDate: string) =>
      api.get(`/admin/analytics/revenue-by-service?startDate=${startDate}&endDate=${endDate}`),
    getCancellationRate: (days = 30) => api.get(`/admin/analytics/cancellation-rate?days=${days}`),
  },

  // Users
  users: {
    getAll: (params?: any) => api.get('/admin/users', { params }),
    getStats: () => api.get('/admin/users/stats'),
    getById: (id: string) => api.get(`/admin/users/${id}`),
    suspend: (id: string, reason: string) => api.patch(`/admin/users/${id}/suspend`, { reason }),
    reactivate: (id: string) => api.patch(`/admin/users/${id}/reactivate`),
  },

  // Employees
  employees: {
    getAll: (params?: any) => api.get('/admin/users/employees', { params }),
    update: (id: string, data: any) => api.patch(`/admin/users/employees/${id}`, data),
  },

  // Bookings
  bookings: {
    getAll: (params?: any) => api.get('/admin/bookings', { params }),
    getStats: () => api.get('/admin/bookings/stats'),
    getById: (id: string) => api.get(`/admin/bookings/${id}`),
    getCalendar: (startDate: string, endDate: string) =>
      api.get(`/admin/bookings/calendar?startDate=${startDate}&endDate=${endDate}`),
    cancel: (id: string, reason: string) => api.patch(`/admin/bookings/${id}/cancel`, { reason }),
    updateStatus: (id: string, status: string) =>
      api.patch(`/admin/bookings/${id}/status`, { status }),
  },

  // Role Requests
  roleRequests: {
    getAll: () => api.get('/role-requests'),
    getById: (id: string) => api.get(`/role-requests/${id}`),
    approve: (id: string, notes?: string) => api.patch(`/role-requests/${id}/approve`, { notes }),
    reject: (id: string, reason: string) => api.patch(`/role-requests/${id}/reject`, { reason }),
  },

  // Chat
  chat: {
    getConversations: (params?: any) => api.get('/admin/chat/conversations', { params }),
    getMessages: (conversationId: string, skip?: number, take?: number) =>
      api.get(`/admin/chat/conversations/${conversationId}/messages`, {
        params: { skip, take },
      }),
    sendMessage: (conversationId: string, content: string, attachments?: string[]) =>
      api.post(`/admin/chat/conversations/${conversationId}/messages`, {
        content,
        attachments,
      }),
    markAsRead: (conversationId: string) =>
      api.patch(`/admin/chat/conversations/${conversationId}/read`),
    getUnreadCount: () => api.get('/admin/chat/unread-count'),
    createConversation: (participantIds: string[], relatedBookingId?: string, tags?: string[]) =>
      api.post('/admin/chat/conversations', { participantIds, relatedBookingId, tags }),
    updateTags: (conversationId: string, tags: string[]) =>
      api.patch(`/admin/chat/conversations/${conversationId}/tags`, { tags }),
    archive: (conversationId: string) =>
      api.patch(`/admin/chat/conversations/${conversationId}/archive`),
  },
};

export default api;
