import axios from 'axios';
import { ErrorHandler } from './errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: process.env.NODE_ENV,
});

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar token e log nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log da requisição
    ErrorHandler.logRequest(
      config.method || 'unknown',
      config.url || 'unknown',
      config.data
    );

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => {
    // Log da resposta bem-sucedida
    ErrorHandler.logResponse(
      response.config.method || 'unknown',
      response.config.url || 'unknown',
      response.status,
      response.data
    );

    return response;
  },
  (error) => {
    // Log detalhado do erro
    ErrorHandler.handleApiError(error);

    // Se for erro de autenticação, redirecionar para login
    if (ErrorHandler.isAuthError(error)) {
      console.warn('🔒 Erro de autenticação - redirecionando para login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Evitar loop infinito se já estiver na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Se for erro de conexão, mostrar mensagem específica
    if (ErrorHandler.isNetworkError(error)) {
      console.error('🌐 Erro de rede - servidor não respondeu');
      console.error('💡 Verifique se o backend está rodando em:', API_BASE_URL);
    }

    return Promise.reject(error);
  }
);

export default api;
