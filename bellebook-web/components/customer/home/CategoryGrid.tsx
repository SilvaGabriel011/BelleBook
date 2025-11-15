'use client';

import { useState } from 'react';
import { Sparkles, Eye, Scissors, Droplet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  image: string;
  count: number;
  color: string;
}

export default function CategoryGrid() {
  const [gender, setGender] = useState<'FEMININO' | 'MASCULINO'>('FEMININO');

  const categories: Category[] = [
    {
      id: '1',
      name: 'Unha',
      icon: <Sparkles className="h-8 w-8" />,
      image: '/category-nails.jpg',
      count: 12,
      color: 'from-pink-400 to-pink-600',
    },
    {
      id: '2',
      name: 'Sobrancelha',
      icon: <Eye className="h-8 w-8" />,
      image: '/category-eyebrows.jpg',
      count: 8,
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: '3',
      name: 'Cabelo',
      icon: <Scissors className="h-8 w-8" />,
      image: '/category-hair.jpg',
      count: 15,
      color: 'from-indigo-400 to-indigo-600',
    },
    {
      id: '4',
      name: 'Depilação',
      icon: <Droplet className="h-8 w-8" />,
      image: '/category-waxing.jpg',
      count: 10,
      color: 'from-teal-400 to-teal-600',
    },
  ];

  return (
    <div>
      {/* Gender Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setGender('FEMININO')}
            className={cn(
              'px-4 py-2 rounded-md font-medium transition-all',
              gender === 'FEMININO'
                ? 'bg-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Feminino
          </button>
          <button
            onClick={() => setGender('MASCULINO')}
            className={cn(
              'px-4 py-2 rounded-md font-medium transition-all',
              gender === 'MASCULINO'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Masculino
          </button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/services?category=${category.id}`}>
            <Card className="group relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-pink-300">
              {/* Background Gradient */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity',
                  category.color
                )}
              />

              {/* Content */}
              <div className="relative p-6 h-40 flex flex-col items-center justify-center text-white">
                <div className="mb-3 transform group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-center mb-2">{category.name}</h3>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {category.count} serviços
                </Badge>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
