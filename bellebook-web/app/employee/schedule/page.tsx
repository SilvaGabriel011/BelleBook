'use client';

import { useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SchedulePage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  // Mock events
  const events = [
    {
      id: '1',
      title: 'Maria Silva - Manicure',
      start: '10:00',
      end: '11:30',
      status: 'confirmed',
      customer: 'Maria Silva',
    },
    {
      id: '2',
      title: 'Ana Costa - Sobrancelha',
      start: '14:00',
      end: '14:45',
      status: 'confirmed',
      customer: 'Ana Costa',
    },
    {
      id: '3',
      title: 'Bloqueado - Almoço',
      start: '12:00',
      end: '13:00',
      status: 'blocked',
      customer: null,
    },
  ];

  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-500 text-green-900';
      case 'pending':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'completed':
        return 'bg-blue-100 border-blue-500 text-blue-900';
      case 'blocked':
        return 'bg-gray-100 border-gray-500 text-gray-900';
      case 'cancelled':
        return 'bg-red-100 border-red-500 text-red-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minha Agenda</h1>
          <p className="text-gray-600 mt-1">Gerencie seus agendamentos e disponibilidade</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Bloquear Horário
        </Button>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
            className={view === 'day' ? 'bg-pink-500 hover:bg-pink-600' : ''}
          >
            Dia
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
            className={view === 'week' ? 'bg-pink-500 hover:bg-pink-600' : ''}
          >
            Semana
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
            className={view === 'month' ? 'bg-pink-500 hover:bg-pink-600' : ''}
          >
            Mês
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm">
            Hoje
          </Button>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jan">Janeiro 2024</SelectItem>
              <SelectItem value="feb">Fevereiro 2024</SelectItem>
              <SelectItem value="mar">Março 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Confirmado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Aguardando</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Concluído</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Cancelado</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            {timeSlots.map((hour) => {
              const hourEvents = events.filter((e) => {
                const eventStart = parseInt(e.start.split(':')[0]);
                return eventStart === hour;
              });

              return (
                <div key={hour} className="flex gap-4 border-b last:border-0 py-2">
                  <div className="w-20 flex-shrink-0 text-sm text-gray-600">{hour}:00</div>
                  <div className="flex-1">
                    {hourEvents.length > 0 ? (
                      <div className="space-y-2">
                        {hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getEventColor(
                              event.status
                            )}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm">{event.title}</p>
                                <p className="text-xs mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.start} - {event.end}
                                </p>
                              </div>
                              {event.customer && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  Detalhes
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-12 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50 cursor-pointer">
                        Disponível
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">8</p>
            <p className="text-sm text-gray-600">Agendamentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">75%</p>
            <p className="text-sm text-gray-600">Taxa de Ocupação</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">12h</p>
            <p className="text-sm text-gray-600">Tempo Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
