import { create } from 'zustand';

export interface BookingServiceItem {
  serviceId: string;
  variantId?: string;
  serviceName: string;
  price: number;
  duration: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes?: string;
  emergencyContact?: string;
}

export interface BookingState {
  // Multi-step flow
  currentStep: number;
  totalSteps: number;

  // Cart items (from cart store)
  services: BookingServiceItem[];
  
  // Step 2: Provider & Schedule
  providerId?: string;
  providerName?: string;
  scheduledAt?: Date;
  
  // Step 3: Customer Info
  customerInfo?: CustomerInfo;
  
  // Step 4: Payment
  paymentMethod?: string;
  
  // Pricing
  subtotal: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  totalDuration: number;
  
  // Confirmation
  confirmationNumber?: string;
  bookingId?: string;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  setServices: (services: BookingServiceItem[]) => void;
  setProvider: (providerId: string, providerName: string) => void;
  setSchedule: (scheduledAt: Date) => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  setPaymentMethod: (method: string) => void;
  applyPromoCode: (code: string, discountAmount: number) => void;
  removePromoCode: () => void;
  
  setConfirmation: (bookingId: string, confirmationNumber: string) => void;
  
  calculateTotals: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  totalSteps: 5,
  services: [],
  subtotal: 0,
  discount: 0,
  totalAmount: 0,
  totalDuration: 0,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setServices: (services) => {
    set({ services });
    get().calculateTotals();
  },

  setProvider: (providerId, providerName) => {
    set({ providerId, providerName });
  },

  setSchedule: (scheduledAt) => {
    set({ scheduledAt });
  },

  setCustomerInfo: (customerInfo) => {
    set({ customerInfo });
  },

  setPaymentMethod: (paymentMethod) => {
    set({ paymentMethod });
  },

  applyPromoCode: (code, discountAmount) => {
    set({ promoCode: code, discount: discountAmount });
    get().calculateTotals();
  },

  removePromoCode: () => {
    set({ promoCode: undefined, discount: 0 });
    get().calculateTotals();
  },

  setConfirmation: (bookingId, confirmationNumber) => {
    set({ bookingId, confirmationNumber });
  },

  calculateTotals: () => {
    const { services, discount } = get();
    
    const subtotal = services.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    const totalDuration = services.reduce(
      (sum, item) => sum + item.duration * item.quantity,
      0
    );
    
    const totalAmount = Math.max(0, subtotal - discount);
    
    set({ subtotal, totalAmount, totalDuration });
  },

  reset: () => set(initialState),
}));
