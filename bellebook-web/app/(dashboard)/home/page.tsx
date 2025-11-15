'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Scissors,
  Eye,
  Palette,
  Sparkles,
  Star,
  Calendar,
  Gift,
  LogOut,
  User as UserIcon,
  Search,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartBadge } from '@/components/CartBadge';

// Mock category data (will come from backend later)
const categories = [
  {
    id: '1',
    name: 'Eyebrows',
    description: 'Design and microblading',
    icon: Eye,
    image: '/images/sobrancelha.jpg',
    color: 'bg-pink-100 text-pink-700',
    services: 12,
  },
  {
    id: '2',
    name: 'Nails',
    description: 'Manicure, pedicure and nail art',
    icon: Palette,
    image: '/images/unha.jpg',
    color: 'bg-purple-100 text-purple-700',
    services: 18,
  },
  {
    id: '3',
    name: 'Hair',
    description: 'Cut, color and treatments',
    icon: Scissors,
    image: '/images/cabelo.jpg',
    color: 'bg-blue-100 text-blue-700',
    services: 25,
  },
  {
    id: '4',
    name: 'Waxing',
    description: 'Laser and wax',
    icon: Sparkles,
    image: '/images/depilacao.jpg',
    color: 'bg-green-100 text-green-700',
    services: 10,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-pink-700">BelleBook</h1>
              <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">Beta</Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Loyalty points */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">
                    {user?.points || 0} points
                  </span>
                </CardContent>
              </Card>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800">
                  <Search className="h-5 w-5" />
                </Button>
                <CartBadge />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-pink-600"
                  onClick={() => router.push('/profile')}
                >
                  <UserIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Greeting and next appointment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">How about booking a special moment for yourself today?</p>
        </div>

        {/* Next appointment card (mocked) */}
        <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-700">Next Appointment</CardTitle>
                <CardDescription>Tuesday, November 15th at 2:00 PM</CardDescription>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Eyebrow Design</p>
                <p className="text-sm text-gray-500">with Maria Silva</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                  Reschedule
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  View details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promotional banner */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-pink-400 to-purple-400">
          <CardContent className="p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">🎉 Special Launch Offer!</h3>
            <p className="mb-4">Get 20% off your first booking. Use code: BELLEBOOK20</p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">Grab Offer</Button>
          </CardContent>
        </Card>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Services</h3>
          <p className="text-gray-600">Choose a category and find the perfect service for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                onClick={() => router.push(`/category/${category.id}`)}
              >
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Icon className="h-24 w-24 text-pink-400" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-800">{category.name}</h4>
                    <Badge className={category.color}>{category.services} services</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="flex items-center mt-4 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'fill-none'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2024 BelleBook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
