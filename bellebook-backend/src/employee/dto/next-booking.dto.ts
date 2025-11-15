export class NextBookingDto {
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
  scheduledAt: Date;
  status: string;
  notes: string | null;
}
