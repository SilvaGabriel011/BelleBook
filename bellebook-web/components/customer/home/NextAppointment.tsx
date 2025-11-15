'use client';

import { Calendar, Clock, MapPin, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NextAppointmentProps {
  booking?: {
    id: string;
    date: string;
    time: string;
    service: string;
    location: string;
    status: string;
  };
}

export default function NextAppointment({ booking }: NextAppointmentProps) {
  if (!booking) return null;

  const appointmentDate = new Date(booking.date);

  return (
    <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            Próximo Agendamento
          </h3>
          <h2 className="text-2xl font-bold text-gray-900">
            {format(appointmentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </h2>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200"
        >
          {booking.status === 'CONFIRMED' ? 'CONFIRMADO' : booking.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Clock className="h-5 w-5 text-pink-500" />
          <span className="font-medium">{booking.time}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-pink-500" />
          <span>{booking.service}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="h-5 w-5 text-pink-500" />
          <span>{booking.location}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
          Ver Detalhes
        </Button>
        <Button variant="outline" className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50">
          Reagendar
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
