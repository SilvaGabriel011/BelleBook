'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, Calendar, User, Download, Share2, Printer, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/store/booking.store';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function BookingStep5Confirmation() {
  const { 
    confirmationNumber, 
    bookingId, 
    scheduledAt, 
    providerName, 
    services, 
    totalAmount, 
    customerInfo,
    reset: resetBooking 
  } = useBookingStore();
  
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const generateICSFile = () => {
    if (!scheduledAt) return;

    const startDate = new Date(scheduledAt);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//BelleBook//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${bookingId}@bellebook.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Agendamento BelleBook - ${services.map(s => s.serviceName).join(', ')}`,
      `DESCRIPTION:Confirmação: ${confirmationNumber}\\nServiços: ${services.map(s => s.serviceName).join(', ')}`,
      `LOCATION:BelleBook`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Lembrete: Agendamento BelleBook amanhã',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bellebook-${confirmationNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareBooking = async () => {
    const shareData = {
      title: 'Agendamento BelleBook',
      text: `Agendamento confirmado! Código: ${confirmationNumber}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `Agendamento BelleBook confirmado!\nCódigo: ${confirmationNumber}\nData: ${scheduledAt ? format(scheduledAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : ''}`;
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  const printBooking = () => {
    window.print();
  };

  const handleNewBooking = () => {
    resetBooking();
    window.location.href = '/home';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Success Animation */}
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="pt-12 pb-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                Agendamento Confirmado!
              </h2>
              <p className="text-muted-foreground">
                Seu agendamento foi realizado com sucesso
              </p>
            </div>
            <div className="inline-block px-6 py-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Código de Confirmação</p>
              <p className="text-2xl font-bold tracking-wider">
                {confirmationNumber || 'BELLE-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date and Time */}
          {scheduledAt && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Data e Horário</p>
                <p className="text-sm text-muted-foreground">
                  {format(scheduledAt, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(scheduledAt, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          )}

          {/* Provider */}
          {providerName && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Profissional</p>
                <p className="text-sm text-muted-foreground">{providerName}</p>
              </div>
            </div>
          )}

          {/* Customer Info */}
          {customerInfo && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Cliente</p>
                <p className="text-sm text-muted-foreground">{customerInfo.name}</p>
                <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Services */}
          <div>
            <p className="font-medium mb-3">Serviços</p>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {service.quantity} • Duração: {service.duration} min
                    </p>
                  </div>
                  <p className="font-semibold">
                    R$ {(service.price * service.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Pago</span>
            <span>R$ {totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={generateICSFile} className="flex-col h-auto py-4">
              <Download className="w-5 h-5 mb-2" />
              <span className="text-xs">Adicionar ao Calendário</span>
            </Button>
            <Button variant="outline" onClick={shareBooking} className="flex-col h-auto py-4">
              <Share2 className="w-5 h-5 mb-2" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            <Button variant="outline" onClick={printBooking} className="flex-col h-auto py-4">
              <Printer className="w-5 h-5 mb-2" />
              <span className="text-xs">Imprimir</span>
            </Button>
            <Button variant="outline" asChild className="flex-col h-auto py-4">
              <a href="/bookings">
                <Calendar className="w-5 h-5 mb-2" />
                <span className="text-xs">Meus Agendamentos</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Confirmação Enviada por Email
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Enviamos todos os detalhes do seu agendamento para {customerInfo?.email}.
                Você também receberá lembretes antes do horário marcado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Booking Button */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleNewBooking} className="w-full" size="lg">
            Fazer Novo Agendamento
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
