'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, DollarSign, Star, TrendingUp, Clock, Users } from 'lucide-react';
import { BookingCard } from '@/components/employee/BookingCard';
import { EmployeeStatCard } from '@/components/employee/EmployeeStatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { employeeApi } from '@/services/employee-api';
import type { DailySummary, NextBooking, Review } from '@/types/employee';

export default function EmployeeHomePage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [nextBookings, setNextBookings] = useState<NextBooking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [summaryData, bookingsData, reviewsData] = await Promise.all([
        employeeApi.getDailySummary(),
        employeeApi.getNextBookings(5),
        employeeApi.getLatestReviews(3),
      ]);

      setSummary(summaryData);
      setNextBookings(bookingsData);
      setReviews(reviewsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      await employeeApi.updateAvailability(checked);
      setIsAvailable(checked);
    } catch (err) {
      console.error('Error updating availability:', err);
      // Revert on error
      setIsAvailable(!checked);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, Profissional! 👋</h1>
          <p className="text-gray-600 mt-1">Veja como está seu dia</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="availability"
            checked={isAvailable}
            onChange={(e) => handleAvailabilityToggle(e.target.checked)}
            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
          />
          <Label htmlFor="availability" className="cursor-pointer">
            {isAvailable ? '🟢 Disponível' : '🔴 Indisponível'}
          </Label>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <EmployeeStatCard
            label="Agendamentos Hoje"
            value={summary.totalBookings}
            icon={Calendar}
            change={12}
            trend="up"
          />
          <EmployeeStatCard
            label="Concluídos"
            value={`${summary.completedToday}/${summary.totalBookings}`}
            icon={TrendingUp}
          />
          <EmployeeStatCard
            label="Receita Estimada"
            value={`R$ ${summary.estimatedRevenue}`}
            icon={DollarSign}
            change={8}
            trend="up"
          />
          <EmployeeStatCard
            label="Avaliação Média"
            value={summary.averageRating}
            icon={Star}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Próximos Agendamentos
            </h2>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          {nextBookings.length > 0 ? (
            <div className="space-y-4">
              {nextBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onStart={() => console.log('Start', booking.id)}
                  onChat={() => console.log('Chat', booking.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-center">
                  Nenhum agendamento próximo
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Bloquear Horário
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Ver Solicitações
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Ajustar Disponibilidade
              </Button>
            </CardContent>
          </Card>

          {/* Latest Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimas Avaliações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{review.customer.name}</p>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{review.service}</p>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-1 italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
