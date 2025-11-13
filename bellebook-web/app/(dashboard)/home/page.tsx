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
  Search
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartBadge } from "@/components/CartBadge";
import { servicesService, Category } from '@/services/services.service';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Eye,
  Palette,
  Scissors,
  Sparkles,
};

const colorMap: Record<string, string> = {
  'Sobrancelha': 'bg-pink-100 text-pink-700',
  'Unha': 'bg-purple-100 text-purple-700',
  'Cabelo': 'bg-blue-100 text-blue-700',
  'Depilação': 'bg-green-100 text-green-700',
};

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    checkAuth();
    
    const loadCategories = async () => {
      try {
        const data = await servicesService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    
    loadCategories();
    
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
          <p className="mt-4 text-gray-600">Carregando...</p>
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
              <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                Beta
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Pontos de fidelidade */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-3 flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">
                    {user?.points || 0} pontos
                  </span>
                </CardContent>
              </Card>

              {/* Menu do usuário */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-800"
                >
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

      {/* Saudação e próximo agendamento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Que tal agendar um momento especial para você hoje?
          </p>
        </div>

        {/* Card de próximo agendamento (mockado) */}
        <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-700">
                  Próximo Agendamento
                </CardTitle>
                <CardDescription>
                  Terça-feira, 15 de Novembro às 14:00
                </CardDescription>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Design de Sobrancelha</p>
                <p className="text-sm text-gray-500">com Maria Silva</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700">
                  Reagendar
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Ver detalhes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Banner promocional */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-pink-400 to-purple-400">
          <CardContent className="p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">
              🎉 Oferta Especial de Lançamento!
            </h3>
            <p className="mb-4">
              Ganhe 20% de desconto na sua primeira reserva. Use o código: BELLEBOOK20
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Aproveitar Oferta
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Nossos Serviços
          </h3>
          <p className="text-gray-600">
            Escolha a categoria e encontre o serviço perfeito para você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon ? iconMap[category.icon] || Sparkles : Sparkles;
            const color = colorMap[category.name] || 'bg-gray-100 text-gray-700';
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
                    <h4 className="font-bold text-lg text-gray-800">
                      {category.name}
                    </h4>
                    <Badge className={color}>
                      {category.servicesCount} serviços
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                  <div className="flex items-center mt-4 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? 'fill-current' : 'fill-none'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.8</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2024 BelleBook. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
