'use client';

import { useState, useEffect } from 'react';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface TimeSlot {
  time: string;
  available: boolean;
  popular?: boolean;
  almostFull?: boolean;
}

export function BookingStep2Schedule() {
  const { previousStep, nextStep, setSchedule, totalDuration, providerId, setProvider } = useBookingStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultProviderId = '1'; // This should come from backend or be selectable
  const defaultProviderName = 'Equipe BelleBook';

  useEffect(() => {
    if (!providerId) {
      setProvider(defaultProviderId, defaultProviderName);
    }
  }, [providerId, setProvider]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (_date: Date) => {
    setLoading(true);
    setError('');
    setSelectedTime(undefined);

    try {
      // const dateStr = format(date, 'yyyy-MM-dd');
      // });
      // setAvailableSlots(response.data.slots);

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const mockSlots: TimeSlot[] = generateMockTimeSlots();
      setAvailableSlots(mockSlots);
    } catch (err) {
      setError('Erro ao carregar horários disponíveis. Tente novamente.');
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;
    const interval = 15; // 15-minute intervals

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const random = Math.random();
        const available = random > 0.3; // 70% available
        const popular = available && random > 0.7; // Some slots are popular
        const almostFull = available && random > 0.85; // Some slots are almost full

        slots.push({
          time,
          available,
          popular,
          almostFull,
        });
      }
    }

    return slots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      setError('Por favor, selecione uma data e horário');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    setSchedule(scheduledDateTime);
    nextStep();
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 90); // Allow booking up to 90 days in advance

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Escolha Data e Horário</CardTitle>
          <p className="text-sm text-muted-foreground">
            Duração total estimada: {totalDuration} minutos
          </p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Selecione a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => isBefore(date, today) || isBefore(maxDate, date)}
              locale={ptBR}
              className="mx-auto"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md',
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-50 cursor-not-allowed',
                day_hidden: 'invisible',
              }}
            />
            {selectedDate && (
              <div className="mt-4 p-3 bg-muted rounded-md text-center">
                <p className="text-sm font-medium">
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Selecione o Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Selecione uma data para ver os horários disponíveis</p>
              </div>
            ) : loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      className="relative"
                    >
                      {slot.time}
                      {slot.popular && slot.available && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" title="Horário popular" />
                      )}
                      {slot.almostFull && slot.available && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" title="Quase lotado" />
                      )}
                    </Button>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Popular</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Quase lotado</span>
                  </div>
                </div>

                {selectedTime && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md text-center">
                    <p className="text-sm font-medium">
                      Horário selecionado: {selectedTime}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={previousStep} className="flex-1">
              Voltar
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={!selectedDate || !selectedTime}
              className="flex-1"
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
