import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'customer' | 'provider';
  displayName?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateDisplayName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.displayName = action.payload;
      }
    },
    updateAvatarUrl: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatarUrl = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, setLoading, setError, updateDisplayName, updateAvatarUrl } = authSlice.actions;
export default authSlice.reducer;
