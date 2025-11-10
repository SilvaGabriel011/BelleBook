import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceStyle {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  likes: number;
  categoryId: string;
  providerId: string;
  providerName?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  serviceCount: number;
}

export interface Favorite {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
}

export type SortOption = 'popularity' | 'price-low' | 'price-high' | 'name';

export interface FilterState {
  categoryId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  sortBy: SortOption;
}

interface CatalogState {
  services: ServiceStyle[];
  filteredServices: ServiceStyle[];
  categories: Category[];
  favorites: string[];
  selectedService: ServiceStyle | null;
  searchQuery: string;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  services: [],
  filteredServices: [],
  categories: [],
  favorites: [],
  selectedService: null,
  searchQuery: '',
  filters: {
    categoryId: null,
    priceMin: null,
    priceMax: null,
    sortBy: 'popularity',
  },
  isLoading: false,
  error: null,
};

const applyFiltersAndSearch = (state: CatalogState) => {
  let filtered = [...state.services];

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }

  if (state.filters.categoryId) {
    filtered = filtered.filter((service) => service.categoryId === state.filters.categoryId);
  }

  if (state.filters.priceMin !== null) {
    filtered = filtered.filter((service) => service.price >= state.filters.priceMin!);
  }

  if (state.filters.priceMax !== null) {
    filtered = filtered.filter((service) => service.price <= state.filters.priceMax!);
  }

  switch (state.filters.sortBy) {
    case 'popularity':
      filtered.sort((a, b) => b.likes - a.likes);
      break;
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  state.filteredServices = filtered;
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServiceStyle[]>) => {
      state.services = action.payload;
      applyFiltersAndSearch(state);
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    setSelectedService: (state, action: PayloadAction<ServiceStyle | null>) => {
      state.selectedService = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFiltersAndSearch(state);
    },
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      applyFiltersAndSearch(state);
    },
    clearFilters: (state) => {
      state.filters = {
        categoryId: null,
        priceMin: null,
        priceMax: null,
        sortBy: 'popularity',
      };
      state.searchQuery = '';
      applyFiltersAndSearch(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setServices,
  setCategories,
  setFavorites,
  toggleFavorite,
  setSelectedService,
  setSearchQuery,
  setFilter,
  clearFilters,
  setLoading,
  setError,
} = catalogSlice.actions;
export default catalogSlice.reducer;
