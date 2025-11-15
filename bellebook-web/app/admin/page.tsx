'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '@/services/admin-api';

interface KPI {
  value: number | string;
  change: number;
  trend: 'up' | 'down';
}

interface DashboardData {
  activeUsers: KPI;
  bookingsToday: KPI;
  monthlyRevenue: KPI;
  pendingRequests: KPI;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Load KPIs and chart data in parallel
        const [overviewRes, chartRes] = await Promise.all([
          adminApi.analytics.getOverview(),
          adminApi.analytics.getBookingsChart(7),
        ]);

        setData(overviewRes.data);
        setChartData(chartRes.data);
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.response?.data?.message || 'Erro ao carregar dados');
        // Fallback to mock data for development
        setData({
          activeUsers: { value: 1234, change: 12.5, trend: 'up' },
          bookingsToday: { value: 45, change: -3.2, trend: 'down' },
          monthlyRevenue: { value: 'R$ 25.4k', change: 18.7, trend: 'up' },
          pendingRequests: { value: 8, change: 0, trend: 'up' },
        });
        setChartData([
          { date: '01/01', count: 12 },
          { date: '02/01', count: 19 },
          { date: '03/01', count: 15 },
          { date: '04/01', count: 25 },
          { date: '05/01', count: 22 },
          { date: '06/01', count: 30 },
          { date: '07/01', count: 28 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-600 mt-1">Acompanhe as principais métricas da plataforma</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Usuários Ativos"
          value={data!.activeUsers.value}
          change={data!.activeUsers.change}
          trend={data!.activeUsers.trend}
          icon={Users}
        />
        <StatCard
          label="Agendamentos Hoje"
          value={data!.bookingsToday.value}
          change={data!.bookingsToday.change}
          trend={data!.bookingsToday.trend}
          icon={Calendar}
        />
        <StatCard
          label="Receita do Mês"
          value={data!.monthlyRevenue.value}
          change={data!.monthlyRevenue.change}
          trend={data!.monthlyRevenue.trend}
          icon={DollarSign}
        />
        <StatCard
          label="Solicitações Pendentes"
          value={data!.pendingRequests.value}
          change={data!.pendingRequests.change}
          trend={data!.pendingRequests.trend}
          icon={Clock}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Agendamentos dos Últimos 7 Dias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FF6B9D"
                strokeWidth={3}
                dot={{ fill: '#FF6B9D', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <a
              href="/admin/requests"
              className="block p-4 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Aprovar Solicitações</p>
                  <p className="text-sm text-gray-600">8 pendentes</p>
                </div>
                <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  8
                </div>
              </div>
            </a>
            <a
              href="/admin/bookings"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Ver Novos Agendamentos</p>
                  <p className="text-sm text-gray-600">15 hoje</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/chat"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mensagens Não Lidas</p>
                  <p className="text-sm text-gray-600">3 conversas</p>
                </div>
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {[
            {
              user: 'Maria Silva',
              action: 'criou um agendamento',
              time: 'Há 5 minutos',
              type: 'booking',
            },
            {
              user: 'João Santos',
              action: 'solicitou mudança de conta para EMPLOYEE',
              time: 'Há 15 minutos',
              type: 'request',
            },
            {
              user: 'Ana Paula',
              action: 'cancelou um agendamento',
              time: 'Há 1 hora',
              type: 'booking',
            },
            {
              user: 'Carlos Lima',
              action: 'concluiu um agendamento',
              time: 'Há 2 horas',
              type: 'booking',
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  activity.type === 'booking'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {activity.type === 'booking' ? 'Agendamento' : 'Solicitação'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
