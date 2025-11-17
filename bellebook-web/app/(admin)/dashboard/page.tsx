'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  CheckCircle,
  Activity,
  FileText,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { analyticsService, DashboardMetrics } from '@/services/analytics.service';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Chart colors
const COLORS = ['#FF6B9D', '#C44569', '#A8DADC', '#FFB5A7', '#E4C1F9'];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    checkAccess();
    loadDashboard();
  }, [period]);

  const checkAccess = () => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      toast.error('Access denied. Administrators only.');
      router.push('/home');
    }
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getDashboardMetrics(period);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Error loading metrics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportReport = async () => {
    toast.success('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name} 👋</p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{metrics.totalBookings}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs previous
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs previous
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* New Clients */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{metrics.newClients}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5 this week
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Completed Services */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{metrics.completedServices}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage((metrics.completedServices / metrics.totalBookings) * 100)} of
                    total
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Average Rating */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold flex items-center">
                    {metrics.averageRating.toFixed(1)}
                    <Star className="h-5 w-5 ml-1 text-yellow-500 fill-current" />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Excellent</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Day Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                      />
                      <YAxis tickFormatter={(value) => `R$ ${value}`} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(date) =>
                          format(new Date(date), "dd 'de' MMMM", { locale: ptBR })
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF6B9D"
                        strokeWidth={2}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Booking Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={metrics.bookingsByStatus as any}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.status}: ${entry.count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {metrics.bookingsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Most Booked Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topServices.map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{service.count} bookings</p>
                        <p className="text-sm text-gray-500">{formatCurrency(service.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{booking.service?.name}</p>
                        <p className="text-sm text-gray-600">
                          Client: {booking.user?.name} | {booking.user?.phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(booking.date), "dd 'de' MMMM", { locale: ptBR })} at{' '}
                          {booking.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === 'CONFIRMED'
                            ? 'default'
                            : booking.status === 'PENDING'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))}

                  {metrics.upcomingBookings.length === 0 && (
                    <Alert>
                      <AlertDescription>No upcoming bookings</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients */}
          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.recentReviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {review.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{review.user?.name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.comment && (
                                <p className="text-sm text-gray-600 mt-2">
                                  &ldquo;{review.comment}&rdquo;
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">{review.service?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Return Rate</span>
                      <span className="font-bold text-green-600">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Satisfaction</span>
                      <span className="font-bold text-yellow-600">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Ticket</span>
                      <span className="font-bold">R$ 125,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Frequency</span>
                      <span className="font-bold">2.5x/month</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Client Source</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Referral</span>
                          <span className="text-sm font-medium">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Instagram</span>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Google</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Others</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            onClick={() => router.push('/admin/reports')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/services')}>
            <Activity className="h-4 w-4 mr-2" />
            Manage Services
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/bookings')}>
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/clients')}>
            <Users className="h-4 w-4 mr-2" />
            Manage Clients
          </Button>
        </div>
      </main>
    </div>
  );
}
