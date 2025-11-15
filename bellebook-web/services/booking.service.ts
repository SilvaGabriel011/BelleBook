import api from '@/lib/api';

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface BookingServiceItem {
  serviceId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface CreateBookingDto {
  serviceId: string;
  providerId?: string;
  services: BookingServiceItem[];
  scheduledAt: Date;
  duration: number;
  totalAmount: number;
  discount?: number;
  promoCode?: string;
  paymentMethod: string;
  notes?: string;
}

export interface ValidatePromoCodeRequest {
  code: string;
  totalAmount: number;
}

export interface PromoCodeResult {
  valid: boolean;
  discount: number;
  discountType: string;
  message?: string;
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

  async rescheduleBooking(bookingId: string, date: string, time: string): Promise<Booking> {
    const { data } = await api.put<Booking>(`/bookings/${bookingId}/reschedule`, {
      date,
      time,
    });
    return data;
  },

  async validatePromoCode(request: ValidatePromoCodeRequest): Promise<PromoCodeResult> {
    const { data } = await api.post<PromoCodeResult>('/bookings/validate-promo', request);
    return data;
  },

  async getProviderAvailability(providerId: string, date: string): Promise<TimeSlot[]> {
    const { data } = await api.get<TimeSlot[]>(`/bookings/provider/${providerId}/availability`, {
      params: { date },
    });
    return data;
  },
};
