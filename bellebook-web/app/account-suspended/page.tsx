'use client';

import { AlertTriangle, Mail, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth.store';

export default function AccountSuspendedPage() {
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 p-4">
      <Card className="max-w-md w-full border-2 border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">Conta Suspensa</CardTitle>
          <CardDescription className="text-base mt-2">
            Sua conta foi suspensa temporariamente
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              Sua conta está atualmente suspensa. Você não poderá acessar os serviços até que a
              suspensão seja removida.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-900">O que isso significa?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Seu acesso ao sistema está temporariamente bloqueado</li>
              <li>• Você não pode realizar agendamentos ou acessar serviços</li>
              <li>• Entre em contato com o suporte para mais informações</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">Entre em Contato</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Se você acredita que isso é um erro, entre em contato com nosso suporte:
                </p>
                <p className="text-sm font-medium text-blue-900 mt-2">
                  suporte@bellebook.com
                </p>
              </div>
            </div>
          </div>

          <Button onClick={logout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
