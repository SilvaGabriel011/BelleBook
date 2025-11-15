'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Service } from '@/store/service.store';
import { useCartStore } from '@/store/cart.store';
import type { Service as CartService } from '@/services/services.service';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  variant?: 'grid' | 'list';
  onFavoriteToggle?: (serviceId: string) => void;
  isFavorite?: boolean;
}

export function ServiceCard({
  service,
  variant = 'grid',
  onFavoriteToggle,
  isFavorite = false,
}: ServiceCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = Number(service.promoPrice || service.price);
  const originalPrice = service.promoPrice ? Number(service.price) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    const cartService: CartService = {
      ...service,
      category: service.category
        ? {
            ...service.category,
            order: 0,
            isActive: true,
            servicesCount: 0,
          }
        : undefined,
    };
    addToCart(cartService);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(service.id);
  };

  const imageUrl = service.images[0] || '/placeholder-service.jpg';

  if (variant === 'list') {
    return (
      <Link href={`/services/${service.id}`}>
        <Card className="overflow-hidden transition-all hover:shadow-lg">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative h-48 w-full sm:h-auto sm:w-64 flex-shrink-0">
              {!imageError ? (
                <Image
                  src={imageUrl}
                  alt={service.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
                  <span className="text-6xl">💅</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {service.isPopular && (
                  <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>
                )}
                {discount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleFavoriteToggle}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:scale-110 hover:bg-white"
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  )}
                />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.category.name}</p>
                </div>

                <p className="mb-4 line-clamp-2 text-gray-700">{service.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                  {service.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.averageRating.toFixed(1)}</span>
                      <span className="text-gray-500">({service.reviewsCount})</span>
                    </div>
                  )}
                </div>
              </div>

              <CardFooter className="mt-4 flex items-center justify-between p-0">
                <div>
                  {originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      R$ {originalPrice.toFixed(2)}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-blue-600">R$ {price.toFixed(2)}</p>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAddingToCart ? (
                    'Adicionado!'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar
                    </>
                  )}
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid variant (default)
  return (
    <Link href={`/services/${service.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-xl">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
              <span className="text-7xl">💅</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {service.isPopular && (
              <Badge className="bg-orange-500 text-white shadow-md hover:bg-orange-600">
                🔥 Popular
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 text-white shadow-md hover:bg-red-600">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>

          {/* Rating Badge */}
          {service.averageRating > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 shadow-md">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-900">
                {service.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-600">({service.reviewsCount})</span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.category.name}</p>
          </div>

          <p className="mb-3 text-sm text-gray-700 line-clamp-2">{service.description}</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{service.duration} minutos</span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex items-center justify-between border-t bg-gray-50 p-4">
          <div>
            {originalPrice && (
              <p className="text-xs text-gray-500 line-through">
                De: R$ {originalPrice.toFixed(2)}
              </p>
            )}
            <p className="text-xl font-bold text-blue-600">R$ {price.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAddingToCart ? (
              '✓ Adicionado'
            ) : (
              <>
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Adicionar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
