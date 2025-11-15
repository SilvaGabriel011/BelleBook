import axios from 'axios';
import type {
  Service,
  ServicePackage,
  ServiceFilters,
  PaginationMeta,
} from '@/store/service.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GetServicesResponse {
  data: Service[];
  meta: PaginationMeta;
}

export interface GetServiceDetailResponse extends Service {
  variants: Array<{
    id: string;
    serviceId: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    isActive: boolean;
  }>;
  reviews: Array<{
    id: string;
    userId: string;
    rating: number;
    comment?: string;
    images?: string[];
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

/**
 * Fetch services with advanced filtering and pagination
 */
export async function getServices(
  filters: ServiceFilters,
  page: number = 1,
  limit: number = 12
): Promise<GetServicesResponse> {
  const params = new URLSearchParams();

  if (filters.category) params.append('category', filters.category);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.search) params.append('search', filters.search);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await api.get<GetServicesResponse>(`/services?${params.toString()}`);
  return response.data;
}

/**
 * Fetch popular services
 */
export async function getPopularServices(limit: number = 10): Promise<Service[]> {
  const response = await api.get<Service[]>(`/services/popular?limit=${limit}`);
  return response.data;
}

/**
 * Fetch service packages
 */
export async function getServicePackages(): Promise<ServicePackage[]> {
  const response = await api.get<ServicePackage[]>('/services/packages');
  return response.data;
}

/**
 * Fetch service details with variants and reviews
 */
export async function getServiceDetails(serviceId: string): Promise<GetServiceDetailResponse> {
  const response = await api.get<GetServiceDetailResponse>(`/services/${serviceId}/details`);
  return response.data;
}

/**
 * Fetch service variants
 */
export async function getServiceVariants(serviceId: string) {
  const response = await api.get(`/services/${serviceId}/variants`);
  return response.data;
}

/**
 * Fetch all categories
 */
export async function getCategories() {
  const response = await api.get('/services/categories');
  return response.data;
}

/**
 * Search services by query
 */
export async function searchServices(query: string): Promise<Service[]> {
  const response = await api.get<Service[]>(`/services/search?q=${encodeURIComponent(query)}`);
  return response.data;
}

export const serviceApi = {
  getServices,
  getPopularServices,
  getServicePackages,
  getServiceDetails,
  getServiceVariants,
  getCategories,
  searchServices,
};
