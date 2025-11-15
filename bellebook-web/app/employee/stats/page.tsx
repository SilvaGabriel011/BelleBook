'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  Star,
  Calendar,
  Users,
  Award,
} from 'lucide-react';
import { EmployeeStatCard } from '@/components/employee/EmployeeStatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { employeeApi } from '@/services/employee-api';
import type { EmployeePerformance } from '@/types/employee';

export default function StatsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | '3months' | 'year'>('month');
  const [performance, setPerformance] = useState<EmployeePerformance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeeApi.getPerformance(period);
      setPerformance(data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  if (loading || !performance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  const { overview, serviceStats } = performance;
  const topServices = serviceStats.slice(0, 5);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
          <p className="text-gray-600 mt-1">Análise de desempenho e métricas</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value: 'week' | 'month' | '3months' | 'year') => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="3months">Últimos 3 Meses</SelectItem>
              <SelectItem value="year">Ano Atual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            Exportar
          </Button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployeeStatCard
          label="Agendamentos"
          value={overview.totalBookings}
          icon={Calendar}
          change={15}
          trend="up"
        />
        <EmployeeStatCard
          label="Receita Total"
          value={`R$ ${overview.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          change={22}
          trend="up"
        />
        <EmployeeStatCard
          label="Ticket Médio"
          value={`R$ ${overview.averageTicket.toFixed(2)}`}
          icon={TrendingUp}
          change={8}
          trend="up"
        />
        <EmployeeStatCard
          label="Avaliação"
          value={overview.averageRating}
          icon={Star}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Mais Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, idx) => (
                <div key={service.serviceId}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{service.serviceName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {service.count}x
                      </p>
                      <p className="text-xs text-gray-600">
                        R$ {service.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${topServices.length > 0 ? (service.count / topServices[0].count) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Taxa de Conclusão
                  </p>
                  <p className="text-xs text-gray-600">
                    {overview.completedBookings} de {overview.totalBookings}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-green-600">
                {((overview.completedBookings / overview.totalBookings) * 100).toFixed(
                  1,
                )}
                %
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Taxa de Cancelamento
                  </p>
                  <p className="text-xs text-gray-600">
                    {overview.cancelledBookings} cancelados
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-red-600">
                {((overview.cancelledBookings / overview.totalBookings) * 100).toFixed(
                  1,
                )}
                %
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Novos Clientes
                  </p>
                  <p className="text-xs text-gray-600">Este período</p>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-600">12</p>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Taxa de Retenção
                  </p>
                  <p className="text-xs text-gray-600">Clientes recorrentes</p>
                </div>
              </div>
              <p className="text-xl font-bold text-purple-600">85%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stars === 5 ? 32 : stars === 4 ? 6 : 0;
              const percentage = (count / overview.totalReviews) * 100;
              return (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-semibold">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
