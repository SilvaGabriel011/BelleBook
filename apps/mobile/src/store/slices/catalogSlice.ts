import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceStyle {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  likes: number;
  categoryId: string;
}

export interface CatalogState {
  services: ServiceStyle[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  services: [],
  favorites: [],
  isLoading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ServiceStyle[]>) => {
      state.services = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setServices, toggleFavorite, setLoading, setError } = catalogSlice.actions;
export default catalogSlice.reducer;
