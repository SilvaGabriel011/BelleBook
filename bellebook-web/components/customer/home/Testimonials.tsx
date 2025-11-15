'use client';

import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  service: string;
  rating: number;
  comment: string;
  date: string;
}

interface TestimonialsProps {
  reviews?: Review[];
}

export default function Testimonials({ reviews = [] }: TestimonialsProps) {
  // Mock data if no reviews provided
  if (reviews.length === 0) {
    reviews = [
      {
        id: '1',
        user: {
          name: 'Maria Silva',
          avatar: 'https://via.placeholder.com/40',
        },
        service: 'Design de Sobrancelhas',
        rating: 5,
        comment:
          'Amei o resultado! A profissional foi super atenciosa e o resultado ficou perfeito. Super recomendo!',
        date: '2024-01-15',
      },
      {
        id: '2',
        user: {
          name: 'Ana Costa',
          avatar: 'https://via.placeholder.com/40',
        },
        service: 'Unha em Gel',
        rating: 5,
        comment:
          'Serviço impecável! Minhas unhas ficaram lindas e o atendimento foi maravilhoso. Voltarei com certeza!',
        date: '2024-01-14',
      },
      {
        id: '3',
        user: {
          name: 'Juliana Santos',
          avatar: 'https://via.placeholder.com/40',
        },
        service: 'Hidratação Capilar',
        rating: 5,
        comment:
          'Meu cabelo estava muito danificado e após o tratamento ficou sedoso e brilhante. Adorei!',
        date: '2024-01-13',
      },
      {
        id: '4',
        user: {
          name: 'Carla Oliveira',
          avatar: 'https://via.placeholder.com/40',
        },
        service: 'Depilação a Laser',
        rating: 4,
        comment: 'Ótimo serviço! Processo indolor e resultados visíveis desde a primeira sessão.',
        date: '2024-01-12',
      },
    ];
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">O que nossas clientes dizem</h2>
        <p className="text-gray-600">
          Confira os depoimentos de quem já experimentou nossos serviços
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Quote Icon */}
            <div className="mb-4">
              <Quote className="h-8 w-8 text-pink-300" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-4 line-clamp-4">{review.comment}</p>

            {/* Service */}
            <p className="text-sm text-pink-600 font-medium mb-4">{review.service}</p>

            {/* User Info */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <Avatar>
                <AvatarImage src={review.user.avatar} />
                <AvatarFallback className="bg-pink-100 text-pink-600">
                  {review.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{review.user.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
