import api from '@/lib/api';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth.types';

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    // Salvar token e dados do usuário
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Salvar token em cookie também (para middleware)
    document.cookie = `token=${data.access_token}; path=/; max-age=604800`; // 7 dias

    return data;
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', userData);

    // Salvar token e dados do usuário
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Salvar token em cookie também (para middleware)
    document.cookie = `token=${data.access_token}; path=/; max-age=604800`; // 7 dias

    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Remover cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
