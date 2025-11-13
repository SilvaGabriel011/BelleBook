import api from '@/lib/api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  order: number;
  isActive: boolean;
  servicesCount: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  duration: number;
  price: string | number;
  promoPrice?: string | number;
  images: string[];
  isActive: boolean;
  category?: Category;
  averageRating?: number;
  reviewsCount?: number;
  bookingsCount?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

export interface ServiceFilters {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const servicesService = {
  async getAllCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/services/categories');
    return data;
  },

  async getByCategory(categoryId: string, filters?: ServiceFilters): Promise<Service[]> {
    const params = new URLSearchParams();
    
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);

    const { data } = await api.get<Service[]>(
      `/services/category/${categoryId}?${params.toString()}`
    );
    return data;
  },

  async getById(id: string): Promise<Service> {
    const { data } = await api.get<Service>(`/services/${id}`);
    return data;
  },

  async searchServices(query: string): Promise<Service[]> {
    const { data } = await api.get<Service[]>(`/services/search?q=${encodeURIComponent(query)}`);
    return data;
  },
};
