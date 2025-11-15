'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bem-vinda ao <span className="text-yellow-300">BelleBook</span>
        </h1>
        <p className="text-lg md:text-xl mb-6 text-pink-100">
          Agende seus serviços de beleza com profissionais incríveis e ganhe
          pontos a cada reserva!
        </p>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar serviços..."
              className="pl-10 bg-white text-gray-900 border-none h-12"
            />
          </div>
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-pink-50 font-semibold"
          >
            Buscar
          </Button>
        </div>

        {/* CTA Button */}
        <Link href="/services">
          <Button
            size="lg"
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold px-8"
          >
            Agendar Agora
          </Button>
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="hidden md:block absolute right-8 bottom-0 opacity-20">
        <div className="w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
