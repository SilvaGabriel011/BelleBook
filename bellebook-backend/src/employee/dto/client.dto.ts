export class ClientCardDto {
  id: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  email: string;
  totalBookings: number;
  lastBooking: Date | null;
  favoriteServices: string[];
  averageFrequency: string | null;
  totalSpent: number;
  notes?: string;
}

export class ClientDetailsDto extends ClientCardDto {
  bookingHistory: Array<{
    id: string;
    serviceName: string;
    date: Date;
    status: string;
    totalPaid: number;
  }>;
  upcomingBookings: Array<{
    id: string;
    serviceName: string;
    scheduledAt: Date;
    status: string;
  }>;
}
