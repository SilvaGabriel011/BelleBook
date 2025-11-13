'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Filter, Star, Clock, ShoppingCart } from 'lucide-react';
import { servicesService, Service, Category } from '@/services/services.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categoryIconMap: Record<string, string> = {
  'Sobrancelha': '👁️',
  'Unha': '💅',
  'Cabelo': '✂️',
  'Depilação': '✨',
};

const categoryColorMap: Record<string, string> = {
  'Sobrancelha': 'bg-pink-100 text-pink-700',
  'Unha': 'bg-purple-100 text-purple-700',
  'Cabelo': 'bg-blue-100 text-blue-700',
  'Depilação': 'bg-green-100 text-green-700',
};

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados dos filtros
  const [sort, setSort] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadServices();
  }, [id, sort, priceRange, searchQuery]);

  const loadServices = async () => {
    try {
      setLoading(true);
      
      // Buscar categoria
      const categories = await servicesService.getAllCategories();
      const currentCategory = categories.find(cat => cat.id === id);
      setCategory(currentCategory || null);

      // Buscar serviços
      const data = await servicesService.getByCategory(id as string, {
        sort,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        search: searchQuery || undefined,
      });
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  const handleAddToCart = (service: Service) => {
    // TODO: Implementar adicionar ao carrinho
    console.log('Adicionar ao carrinho:', service);
    router.push(`/service/${service.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  const categoryName = category?.name || '';
  const meta = {
    icon: categoryIconMap[categoryName] || '📦',
    color: categoryColorMap[categoryName] || 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/home')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{meta.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {category?.name || 'Categoria'}
                  </h1>
                  {category?.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-pink-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ordenação */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Ordenar por
                </label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Faixa de preço */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Busca */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Buscar
                </label>
                <Input
                  placeholder="Nome do serviço..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de serviços */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">Nenhum serviço encontrado nesta categoria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
              >
                {/* Imagem placeholder */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-30">{meta.icon}</span>
                  </div>
                  {service.promoPrice && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      Promoção
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Informações */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} min
                    </div>
                    {service.averageRating ? (
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">{service.averageRating}</span>
                        <span className="text-gray-500 ml-1">
                          ({service.reviewsCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sem avaliações</span>
                    )}
                  </div>

                  {/* Preços */}
                  <div className="mb-4">
                    {service.promoPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-sm">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-2xl font-bold text-pink-600">
                          {formatPrice(service.promoPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">
                        {formatPrice(service.price)}
                      </span>
                    )}
                    {service.promoPrice && (
                      <p className="text-xs text-green-600 mt-1">
                        Economize {formatPrice(Number(service.price) - Number(service.promoPrice))}
                      </p>
                    )}
                  </div>

                  {/* Botão */}
                  <Button
                    onClick={() => handleAddToCart(service)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
