import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service } from '@/services/services.service';

export interface CartItem {
  id: string;
  service: Service;
  quantity: number;
  selectedDate?: string;
  selectedTime?: string;
  notes?: string;
}

export interface CartStore {
  items: CartItem[];
  coupon: string | null;
  discount: number;

  // Actions
  addToCart: (service: Service, quantity?: number, date?: string, time?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSchedule: (itemId: string, date: string, time: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Getters
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      addToCart: (service, quantity = 1, date, time) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.service.id === service.id);

          if (existingItem) {
            // Se já existe, aumenta a quantidade
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }

          // Adiciona novo item
          const newItem: CartItem = {
            id: `${service.id}-${Date.now()}`,
            service,
            quantity,
            selectedDate: date,
            selectedTime: time,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }));
      },

      updateSchedule: (itemId, date, time) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, selectedDate: date, selectedTime: time } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null, discount: 0 });
      },

      applyCoupon: async (code) => {
        // TODO: Validar cupom no backend
        // Por enquanto, cupons mockados
        const coupons: Record<string, number> = {
          PRIMEIRA10: 10,
          BELEZA20: 20,
          VIP30: 30,
        };

        const discountPercent = coupons[code.toUpperCase()];

        if (discountPercent) {
          set({ coupon: code, discount: discountPercent });
          return true;
        }

        return false;
      },

      removeCoupon: () => {
        set({ coupon: null, discount: 0 });
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const price = Number(item.service.promoPrice || item.service.price);
          return total + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        const state = get();
        if (!state.coupon || !state.discount) return 0;
        return (state.getSubtotal() * state.discount) / 100;
      },

      getTotal: () => {
        const state = get();
        return state.getSubtotal() - state.getDiscount();
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'bellebook-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        discount: state.discount,
      }),
    }
  )
);
