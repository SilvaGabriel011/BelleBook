'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ClientListItemProps {
  client: {
    id: string;
    name: string;
    avatar: string | null;
    phone: string | null;
    email: string;
    totalBookings: number;
    lastBooking: Date | null;
    favoriteServices: string[];
    totalSpent: number;
  };
  onClick?: () => void;
}

export function ClientListItem({ client, onClick }: ClientListItemProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={client.avatar || undefined} alt={client.name} />
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {client.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{client.name}</p>
              <p className="text-sm text-gray-600">{client.phone || client.email}</p>
              <div className="flex gap-1 mt-1">
                {client.favoriteServices.slice(0, 2).map((service, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="text-right flex items-center gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {client.totalBookings} agendamentos
              </p>
              <p className="text-xs text-gray-600">
                {client.lastBooking
                  ? `Última: ${formatDistanceToNow(new Date(client.lastBooking), {
                      locale: ptBR,
                      addSuffix: true,
                    })}`
                  : 'Sem agendamentos'}
              </p>
              <p className="text-xs font-semibold text-green-600 mt-1">
                R$ {client.totalSpent.toFixed(2)}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
