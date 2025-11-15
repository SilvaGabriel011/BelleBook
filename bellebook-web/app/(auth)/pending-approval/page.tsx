'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, AlertCircle, Loader2, Home, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { roleRequestService } from '@/services/role-request.service';
import { useAuthStore } from '@/store/auth.store';
import type { RoleRequest } from '@/types/role-request.types';

export default function PendingApprovalPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [request, setRequest] = useState<RoleRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await roleRequestService.getMyRoleRequest();
        setRequest(data);

        // If approved, refresh and redirect
        if (data?.status === 'APPROVED') {
          // Refresh auth state
          window.location.href = '/home';
        }

        // If rejected, stay on page but show rejection reason
      } catch (err) {
        const errorMessage =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Erro ao carregar solicitação'
            : 'Erro ao carregar solicitação';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();

    // Poll every 30 seconds
    const interval = setInterval(fetchRequest, 30000);

    return () => clearInterval(interval);
  }, []);

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      EMPLOYEE: 'Profissional',
      ADMIN: 'Administrador',
      CUSTOMER: 'Cliente',
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error || 'Nenhuma solicitação encontrada'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/home')} className="w-full mt-4">
              Ir para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (request.status === 'REJECTED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <Card className="max-w-2xl w-full border-2 border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-red-700">Solicitação Rejeitada</CardTitle>
            <CardDescription className="text-base mt-2">
              Sua solicitação para {getRoleDisplayName(request.requestedRole)} foi rejeitada
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                <strong>Motivo da rejeição:</strong>
                <p className="mt-2">{request.adminNotes || 'Não especificado'}</p>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">O que fazer agora?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Você pode solicitar novamente após revisar os requisitos</li>
                <li>• Entre em contato com o suporte se tiver dúvidas</li>
                <li>• Continue usando sua conta como Cliente normalmente</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/role-selection')}
                variant="outline"
                className="flex-1"
              >
                Solicitar Novamente
              </Button>
              <Button
                onClick={() => router.push('/home')}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
              >
                <Home className="mr-2 h-4 w-4" />
                Ir para Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-3xl text-gray-900">Solicitação em Análise</CardTitle>
            <CardDescription className="text-base mt-2">
              Sua solicitação para {getRoleDisplayName(request.requestedRole)} está sendo analisada
              por nossa equipe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                <strong>Tempo estimado:</strong> até 48 horas úteis
              </AlertDescription>
            </Alert>

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-green-500"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900">Solicitação Enviada</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sua solicitação foi recebida com sucesso
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center animate-pulse">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-gray-300"></div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-900">Em Análise</h3>
                  <p className="text-sm text-gray-600">Aguardando aprovação</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Nossa equipe está avaliando sua solicitação
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-gray-500">Decisão Final</h3>
                  <p className="text-sm text-gray-400">Pendente</p>
                  <p className="text-sm text-gray-400 mt-1">Você receberá um email com a decisão</p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Detalhes da Solicitação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role solicitado:</span>
                  <span className="font-medium">{getRoleDisplayName(request.requestedRole)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role atual:</span>
                  <span className="font-medium">{getRoleDisplayName(request.currentRole)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-amber-600">Pendente</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <Alert>
              <AlertDescription>
                <strong>O que você pode fazer enquanto espera:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Verificar seu email regularmente</li>
                  <li>• Acessar esta página para ver atualizações</li>
                  <li>• Entrar em contato com o suporte se tiver dúvidas</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={logout} className="flex-1">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                <Loader2 className="mr-2 h-4 w-4" />
                Atualizar Status
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Precisa de ajuda?{' '}
              <a href="/support" className="text-purple-600 hover:underline">
                Entre em contato com o suporte
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
