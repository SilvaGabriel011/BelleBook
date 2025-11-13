import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export class ErrorHandler {
  /**
   * Processa e formata erros de API
   */
  static handleApiError(error: unknown): ApiError {
    // Log completo do erro no console para debug
    console.group('🚨 API Error Details');
    console.error('Error Object:', error);

    if (error instanceof AxiosError) {
      console.error('Axios Error Details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        },
      });

      // Erro de resposta do servidor
      if (error.response) {
        const { status, data } = error.response;
        
        console.error('Server Response Error:', {
          status,
          data,
        });

        // Erro estruturado do backend (NestJS)
        if (data && typeof data === 'object') {
          const errorData = data as any;
          
          console.groupEnd();
          return {
            message: errorData.message || error.message || 'Erro no servidor',
            statusCode: status,
            errors: errorData.errors,
          };
        }

        // Erro genérico do servidor
        console.groupEnd();
        return {
          message: this.getStatusMessage(status),
          statusCode: status,
        };
      }

      // Erro de requisição (sem resposta do servidor)
      if (error.request) {
        console.error('Request Error (No Response):', {
          request: error.request,
          message: 'Servidor não respondeu',
        });
        console.groupEnd();
        
        return {
          message: '❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001',
          statusCode: 0,
        };
      }

      // Erro de configuração
      console.error('Config Error:', error.message);
      console.groupEnd();
      return {
        message: error.message,
      };
    }

    // Erro genérico
    console.error('Generic Error:', error);
    console.groupEnd();
    
    return {
      message: 'Ocorreu um erro inesperado. Verifique o console para mais detalhes.',
    };
  }

  /**
   * Retorna mensagem amigável baseada no status code
   */
  private static getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Requisição inválida',
      401: 'Credenciais inválidas',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      409: 'Email já está em uso',
      422: 'Dados inválidos',
      500: 'Erro interno do servidor',
      502: 'Serviço indisponível',
      503: 'Serviço temporariamente indisponível',
    };

    return messages[status] || `Erro no servidor (${status})`;
  }

  /**
   * Log de requisição para debug
   */
  static logRequest(method: string, url: string, data?: any) {
    console.group(`📤 API Request: ${method.toUpperCase()} ${url}`);
    if (data) {
      console.log('Request Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Log de resposta para debug
   */
  static logResponse(method: string, url: string, status: number, data?: any) {
    console.group(`📥 API Response: ${method.toUpperCase()} ${url} - ${status}`);
    if (data) {
      console.log('Response Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Verifica se é erro de autenticação
   */
  static isAuthError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status === 401;
    }
    return false;
  }

  /**
   * Verifica se é erro de conexão
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return !error.response && !!error.request;
    }
    return false;
  }
}
