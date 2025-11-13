import api from '@/lib/api';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface CreateBookingDto {
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  totalPaid: string | number;
  notes?: string;
  service?: {
    id: string;
    name: string;
    category?: {
      name: string;
    };
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}

export const bookingService = {
  async getAvailableSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
    const { data } = await api.get<TimeSlot[]>(`/bookings/slots`, {
      params: { serviceId, date },
    });
    return data;
  },

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    const { data } = await api.post<Booking>('/bookings', bookingData);
    return data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data } = await api.get<Booking[]>('/bookings/my');
    return data;
  },

  async getNextBooking(): Promise<Booking | null> {
    const { data } = await api.get<Booking>('/bookings/next');
    return data;
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const { data } = await api.delete<Booking>(`/bookings/${bookingId}`);
    return data;
  },

  async rescheduleBooking(
    bookingId: string,
    date: string,
    time: string
  ): Promise<Booking> {
    const { data } = await api.put<Booking>(`/bookings/${bookingId}/reschedule`, {
      date,
      time,
    });
    return data;
  },
};
