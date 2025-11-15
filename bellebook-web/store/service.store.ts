import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon?: string;
    image?: string;
  };
  price: number;
  promoPrice?: number;
  duration: number;
  images: string[];
  gender?: string;
  isActive: boolean;
  isPopular: boolean;
  averageRating: number;
  reviewsCount: number;
  bookingsCount: number;
  variants?: ServiceVariant[];
}

export interface ServiceVariant {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  services: Array<{
    serviceId: string;
    variantId?: string;
    quantity: number;
  }>;
  packagePrice: number;
  sessionsCount: number;
  validDays?: number;
  isActive: boolean;
}

export interface ServiceFilters {
  category?: string;
  gender?: 'FEMININO' | 'MASCULINO' | 'UNISEX' | '';
  minPrice?: number;
  maxPrice?: number;
  sort?: 'name' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceStore {
  // State
  services: Service[];
  popularServices: Service[];
  packages: ServicePackage[];
  selectedService: Service | null;
  filters: ServiceFilters;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';

  // Actions
  setServices: (services: Service[]) => void;
  setPopularServices: (services: Service[]) => void;
  setPackages: (packages: ServicePackage[]) => void;
  setSelectedService: (service: Service | null) => void;
  setFilters: (filters: Partial<ServiceFilters>) => void;
  resetFilters: () => void;
  setPagination: (meta: PaginationMeta) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // Getters
  getFilteredServices: () => Service[];
  hasActiveFilters: () => boolean;
}

const initialFilters: ServiceFilters = {
  category: '',
  gender: '',
  minPrice: undefined,
  maxPrice: undefined,
  sort: 'popular',
  search: '',
};

export const useServiceStore = create<ServiceStore>((set, get) => ({
  // Initial state
  services: [],
  popularServices: [],
  packages: [],
  selectedService: null,
  filters: initialFilters,
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  viewMode: 'grid',

  // Actions
  setServices: (services) => set({ services, error: null }),
  
  setPopularServices: (popularServices) => set({ popularServices }),
  
  setPackages: (packages) => set({ packages }),
  
  setSelectedService: (service) => set({ selectedService: service }),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1 when filters change
    })),
  
  resetFilters: () =>
    set({
      filters: initialFilters,
      pagination: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
      },
    }),
  
  setPagination: (meta) => set({ pagination: meta }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  setViewMode: (mode) => set({ viewMode: mode }),

  // Getters
  getFilteredServices: () => {
    const { services, filters } = get();
    let filtered = [...services];

    // Client-side filtering as fallback (API should handle this)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.gender) {
      filtered = filtered.filter((service) => !service.gender || service.gender === filters.gender);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(
        (service) => Number(service.promoPrice || service.price) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(
        (service) => Number(service.promoPrice || service.price) <= filters.maxPrice!
      );
    }

    return filtered;
  },

  hasActiveFilters: () => {
    const { filters } = get();
    return (
      !!filters.category ||
      !!filters.gender ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      !!filters.search
    );
  },
}));
