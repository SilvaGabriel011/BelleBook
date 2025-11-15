'use client';

import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
}

interface PromoBannerProps {
  banners?: Banner[];
}

export default function PromoBanner({ banners = [] }: PromoBannerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (banners.length === 0) {
    // Default banner if none provided
    banners = [
      {
        id: '1',
        title: '🎉 Primeira Reserva Grátis!',
        description: 'Ganhe +50 pontos na sua primeira reserva',
        image: '/banner-promo-1.jpg',
        link: '/services',
      },
      {
        id: '2',
        title: '💖 Pacote Completo com 30% OFF',
        description: 'Unha + Sobrancelha + Depilação',
        image: '/banner-promo-2.jpg',
        link: '/services',
      },
    ];
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0">
              <Link href={banner.link || '#'}>
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-2xl overflow-hidden cursor-pointer group">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform">
                      {banner.title}
                    </h2>
                    {banner.description && (
                      <p className="text-lg md:text-xl text-pink-100">
                        {banner.description}
                      </p>
                    )}
                    <Button
                      size="lg"
                      className="mt-6 bg-white text-pink-600 hover:bg-pink-50 font-semibold w-fit"
                    >
                      Aproveitar Agora
                    </Button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? 'w-8 bg-pink-500'
                    : 'w-2 bg-gray-300'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
