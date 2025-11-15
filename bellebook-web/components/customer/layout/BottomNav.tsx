'use client';

import { Home, List, Calendar, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const cartCount = 2; // Replace with actual cart count from store

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      active: pathname === '/',
    },
    {
      label: 'Serviços',
      icon: List,
      href: '/services',
      active: pathname.startsWith('/services'),
    },
    {
      label: 'Agendamentos',
      icon: Calendar,
      href: '/appointments',
      active: pathname.startsWith('/appointments'),
    },
    {
      label: 'Perfil',
      icon: User,
      href: '/profile',
      active: pathname.startsWith('/profile'),
    },
    {
      label: 'Carrinho',
      icon: ShoppingCart,
      href: '/cart',
      active: pathname.startsWith('/cart'),
      badge: cartCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 shadow-lg md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors',
                item.active ? 'text-pink-600' : 'text-gray-600 hover:text-pink-500'
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-pink-500">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
