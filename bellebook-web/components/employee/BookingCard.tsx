'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BookingCardProps {
  booking: {
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
  };
  onStart?: () => void;
  onChat?: () => void;
  onCancel?: () => void;
}

export function BookingCard({ booking, onStart, onChat }: BookingCardProps) {
  return (
    <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {format(new Date(booking.scheduledAt), 'HH:mm')}
            </p>
            <p className="text-sm text-gray-600">
              {format(new Date(booking.scheduledAt), "dd 'de' MMMM", {
                locale: ptBR,
              })}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            CONFIRMADO
          </Badge>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={booking.customer.avatar || undefined}
              alt={booking.customer.name}
            />
            <AvatarFallback className="bg-pink-100 text-pink-700">
              {booking.customer.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {booking.customer.name}
            </p>
            <p className="text-sm text-gray-600">{booking.service.name}</p>
            <p className="text-xs text-gray-500">
              {booking.service.duration} min
            </p>
          </div>
        </div>

        {booking.notes && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
            <p className="text-amber-800">
              <span className="font-semibold">Nota:</span> {booking.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onStart}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar
          </Button>
          <Button
            onClick={onChat}
            variant="outline"
            className="px-4 border-gray-300 hover:bg-gray-50"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
