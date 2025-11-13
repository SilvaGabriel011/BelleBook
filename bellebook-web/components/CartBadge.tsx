'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function CartBadge() {
  const router = useRouter();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const itemCount = getItemCount();

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/cart')}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center font-bold">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Button>
  );
}
