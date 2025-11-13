'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock, Crown, User, Briefcase, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { ErrorHandler } from '@/lib/errorHandler';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    console.log('🔐 Tentando fazer login com:', { email: data.email });

    try {
      const response = await authService.login(data);
      console.log('✅ Login bem-sucedido:', response.user);
      setUser(response.user);
      router.push('/home');
    } catch (err) {
      console.error('❌ Erro ao fazer login:', err);
      const apiError = ErrorHandler.handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async (email: string) => {
    setValue('email', email);
    setValue('password', 'senha123');
    // Submeter automaticamente
    await onSubmit({ email, password: 'senha123' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-pink-200 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-pink-700">BelleBook</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            {/* Contas Demo */}
            <div className="mt-6 space-y-3">
              <p className="text-xs text-center text-gray-600 font-medium">
                🎭 Contas Demo para Testes
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => loginWithDemo('admin@bellebook.com')}
                  className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-xs"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => loginWithDemo('cliente@bellebook.com')}
                  className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  Cliente
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => loginWithDemo('funcionaria@bellebook.com')}
                  className="border-green-200 hover:bg-green-50 hover:border-green-300 text-xs"
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  Funcionária
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => loginWithDemo('vip@bellebook.com')}
                  className="border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-xs"
                >
                  <Star className="h-3 w-3 mr-1" />
                  VIP
                </Button>
              </div>

              <p className="text-[10px] text-center text-gray-400">
                Todas as contas usam a senha:{' '}
                <code className="bg-gray-100 px-1 rounded">senha123</code>
              </p>
            </div>

            <div className="mt-4">
              <Link href="/register" passHref>
                <Button variant="outline" className="w-full border-pink-200 hover:bg-pink-50">
                  Criar nova conta
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <p className="text-xs text-center text-gray-500 w-full">
            Ao continuar, você concorda com nossos{' '}
            <Link href="/terms" className="text-pink-600 hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-pink-600 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
