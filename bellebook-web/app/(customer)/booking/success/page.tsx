'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface BookingDetails {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    duration: number;
  };
  totalPaid: number;
  status: string;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Pagamento Confirmado! 🎉</h1>
            <p className="text-gray-600">Seu agendamento foi confirmado com sucesso.</p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="mb-8 space-y-4 rounded-lg bg-pink-50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Detalhes do Agendamento</h2>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Data</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Horário</p>
                  <p className="text-sm text-gray-600">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Serviço</p>
                  <p className="text-sm text-gray-600">{booking.service.name}</p>
                  <p className="text-xs text-gray-500">
                    Duração: {booking.service.duration} minutos
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-pink-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Pago</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {booking.totalPaid.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info Message */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              📧 Enviamos um email de confirmação com todos os detalhes do seu agendamento.
            </p>
            <p className="mt-2 text-sm text-blue-900">
              🔔 Você receberá lembretes antes da sua sessão.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => router.push('/customer/bookings')}
              className="flex-1"
              variant="default"
            >
              Ver Meus Agendamentos
            </Button>
            <Button onClick={() => router.push('/customer')} className="flex-1" variant="outline">
              Voltar para Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
