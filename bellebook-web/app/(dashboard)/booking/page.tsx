'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCartStore } from '@/store/cart.store';
import { bookingService, TimeSlot } from '@/services/booking.service';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BookingPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentBookingIndex, setCurrentBookingIndex] = useState(0);

  // Pegar o item atual do carrinho
  const currentItem = items[currentBookingIndex];

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate || !currentItem) return;

      setLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const slots = await bookingService.getAvailableSlots(
          currentItem.service.id,
          dateStr
        );
        setTimeSlots(slots);
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        toast.error('Erro ao carregar horários disponíveis');
      } finally {
        setLoadingSlots(false);
      }
    };
    
    loadSlots();
  }, [selectedDate, currentItem]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const handleConfirmBooking = async () => {
    if (!currentItem || !selectedDate || !selectedTime) {
      toast.error('Por favor, selecione data e horário');
      return;
    }

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      await bookingService.createBooking({
        serviceId: currentItem.service.id,
        date: dateStr,
        time: selectedTime,
        notes: notes || undefined,
      });

      toast.success(`Agendamento confirmado para ${format(selectedDate, "dd/MM/yyyy")} às ${selectedTime}`);

      // Se houver mais itens no carrinho, ir para o próximo
      if (currentBookingIndex < items.length - 1) {
        setCurrentBookingIndex(currentBookingIndex + 1);
        setSelectedDate(null);
        setSelectedTime('');
        setTimeSlots([]);
        setNotes('');
      } else {
        // Todos os agendamentos foram feitos
        clearCart();
        router.push('/bookings');
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao confirmar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <header className="bg-white shadow-sm border-b border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Agendamento</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center py-12">
            <CardContent>
              <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum serviço para agendar
              </h2>
              <p className="text-gray-500 mb-6">
                Adicione serviços ao carrinho para fazer o agendamento
              </p>
              <Button onClick={() => router.push('/home')}>
                Explorar Serviços
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                Agendamento ({currentBookingIndex + 1} de {items.length})
              </h1>
            </div>

            <Badge variant="secondary" className="text-sm">
              {items.length - currentBookingIndex} {items.length - currentBookingIndex === 1 ? 'restante' : 'restantes'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Calendário e Horários */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card do Serviço Atual */}
            {currentItem && (
              <Card>
                <CardHeader>
                  <CardTitle>Agendando Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💆‍♀️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{currentItem.service.name}</h3>
                      <p className="text-sm text-gray-600">
                        {currentItem.service.category?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {currentItem.service.duration} minutos
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendário */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Escolha uma Data</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth().map(day => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    const isTodayDate = isToday(day);

                    return (
                      <Button
                        key={day.toString()}
                        variant={isSelected ? 'default' : 'ghost'}
                        className={cn(
                          'h-10 w-full',
                          isSelected && 'bg-pink-500 hover:bg-pink-600 text-white',
                          isTodayDate && !isSelected && 'border-2 border-pink-300',
                          isPast && 'opacity-50 cursor-not-allowed'
                        )}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime('');
                        }}
                      >
                        {format(day, 'd')}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Horários */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>Escolha um Horário</CardTitle>
                  <CardDescription>
                    Horários disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Nenhum horário disponível nesta data. Por favor, escolha outra data.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? 'default' : 'outline'}
                          className={cn(
                            'h-12',
                            selectedTime === slot.time && 'bg-pink-500 hover:bg-pink-600 text-white',
                            !slot.available && 'opacity-50 cursor-not-allowed'
                          )}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Alguma observação especial para este agendamento?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Resumo Lateral */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Serviço */}
                <div>
                  <Label className="text-xs text-gray-500">Serviço</Label>
                  <p className="font-medium">{currentItem?.service.name}</p>
                </div>

                {/* Data e Hora */}
                {selectedDate && (
                  <div>
                    <Label className="text-xs text-gray-500">Data</Label>
                    <p className="font-medium">
                      {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <Label className="text-xs text-gray-500">Horário</Label>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                )}

                <Separator />

                {/* Valor */}
                <div>
                  <Label className="text-xs text-gray-500">Valor</Label>
                  <p className="text-2xl font-bold text-pink-600">
                    {currentItem && formatPrice(
                      currentItem.service.promoPrice || currentItem.service.price
                    )}
                  </p>
                </div>

                {/* Status */}
                {selectedDate && selectedTime ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Pronto para confirmar agendamento
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Selecione data e horário para continuar
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botões */}
                <div className="space-y-2">
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={!selectedDate || !selectedTime || loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirmando...
                      </>
                    ) : currentBookingIndex < items.length - 1 ? (
                      'Confirmar e Próximo'
                    ) : (
                      'Confirmar Agendamento'
                    )}
                  </Button>
                  
                  {currentBookingIndex < items.length - 1 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setCurrentBookingIndex(currentBookingIndex + 1);
                        setSelectedDate(null);
                        setSelectedTime('');
                        setTimeSlots([]);
                        setNotes('');
                      }}
                      className="w-full"
                    >
                      Pular este serviço
                    </Button>
                  )}
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 space-y-1 pt-2">
                  <p>✓ Confirmação imediata</p>
                  <p>✓ Lembretes automáticos</p>
                  <p>✓ Cancelamento até 24h antes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
