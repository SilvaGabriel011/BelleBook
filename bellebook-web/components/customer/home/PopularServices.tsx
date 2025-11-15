'use client';

import { Star, Heart, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  duration: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

interface PopularServicesProps {
  services?: Service[];
}

export default function PopularServices({ services = [] }: PopularServicesProps) {
  // Mock data if no services provided
  if (services.length === 0) {
    services = [
      {
        id: '1',
        name: 'Unha em Gel Decorada',
        description: 'Unhas lindas e duradouras com design personalizado',
        price: 80,
        promoPrice: 59.9,
        duration: 90,
        rating: 4.8,
        reviewsCount: 124,
        image: '/service-nails.jpg',
      },
      {
        id: '2',
        name: 'Design de Sobrancelhas',
        description: 'Sobrancelhas perfeitas com técnica de fio a fio',
        price: 50,
        promoPrice: 39.9,
        duration: 45,
        rating: 4.9,
        reviewsCount: 98,
        image: '/service-eyebrows.jpg',
      },
      {
        id: '3',
        name: 'Hidratação Profunda',
        description: 'Tratamento capilar com produtos premium',
        price: 120,
        duration: 60,
        rating: 4.7,
        reviewsCount: 87,
        image: '/service-hair.jpg',
      },
      {
        id: '4',
        name: 'Depilação a Laser',
        description: 'Depilação definitiva e indolor',
        price: 150,
        promoPrice: 99.9,
        duration: 30,
        rating: 4.9,
        reviewsCount: 156,
        image: '/service-laser.jpg',
      },
    ];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Serviços Populares</h2>
        <Link href="/services">
          <Button variant="link" className="text-pink-600">
            Ver todos →
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <Link key={service.id} href={`/services/${service.id}`}>
            <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300">
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                  ✨
                </div>
                {service.promoPrice && (
                  <Badge className="absolute top-3 right-3 bg-pink-500 text-white">
                    {Math.round(((service.price - service.promoPrice) / service.price) * 100)}% OFF
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 left-3 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to favorites logic
                  }}
                >
                  <Heart className="h-5 w-5 text-pink-500" />
                </Button>
              </div>

              {/* Service Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {service.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{service.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({service.reviewsCount} avaliações)
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {service.promoPrice ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          De R$ {service.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-pink-600" />
                          <span className="text-xl font-bold text-pink-600">
                            {service.promoPrice.toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-900" />
                        <span className="text-xl font-bold text-gray-900">
                          {service.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Agendar
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
