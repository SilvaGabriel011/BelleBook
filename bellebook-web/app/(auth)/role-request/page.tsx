'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Scissors,
  Shield,
  ArrowLeft,
  FileText,
  Briefcase,
  Award,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { roleRequestService } from '@/services/role-request.service';
import type { CreateRoleRequestDto } from '@/types/role-request.types';

const employeeSchema = z.object({
  requestedRole: z.literal('EMPLOYEE'),
  reason: z.string().min(50, 'A justificativa deve ter pelo menos 50 caracteres'),
  experience: z.string().min(100, 'Descreva sua experiência com pelo menos 100 caracteres'),
  certifications: z.string().optional(),
  motivation: z.string().optional(),
});

const adminSchema = z.object({
  requestedRole: z.literal('ADMIN'),
  reason: z.string().min(50, 'A justificativa deve ter pelo menos 50 caracteres'),
  department: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;
type AdminFormData = z.infer<typeof adminSchema>;

function RoleRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = (searchParams.get('role') || 'EMPLOYEE') as 'EMPLOYEE' | 'ADMIN';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmployee = requestedRole === 'EMPLOYEE';
  const schema = isEmployee ? employeeSchema : adminSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmployeeFormData | AdminFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      requestedRole,
    } as EmployeeFormData | AdminFormData,
  });

  useEffect(() => {
    setValue('requestedRole' as never, requestedRole as never);
  }, [requestedRole, setValue]);

  const onSubmit = async (data: EmployeeFormData | AdminFormData) => {
    setLoading(true);
    setError('');

    try {
      await roleRequestService.createRoleRequest(data as CreateRoleRequestDto);
      router.push('/pending-approval');
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Erro ao criar solicitação'
          : 'Erro ao criar solicitação';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    EMPLOYEE: {
      title: 'Solicitar Acesso como Profissional',
      description: 'Preencha o formulário abaixo para solicitar acesso como profissional',
      icon: <Scissors className="h-12 w-12 text-purple-600" />,
      color: 'purple',
    },
    ADMIN: {
      title: 'Solicitar Acesso como Administrador',
      description: 'Preencha o formulário abaixo para solicitar acesso administrativo',
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      color: 'blue',
    },
  };

  const config = roleConfig[requestedRole];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-white/50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`${
                  config.color === 'purple' ? 'bg-purple-100' : 'bg-blue-100'
                } p-4 rounded-2xl`}
              >
                {config.icon}
              </div>
              <div>
                <CardTitle className="text-3xl">{config.title}</CardTitle>
                <CardDescription className="text-base mt-2">{config.description}</CardDescription>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-amber-800">
                <strong>Tempo de análise:</strong> Sua solicitação será analisada em até 48 horas
                úteis. Você receberá um email com a decisão.
              </AlertDescription>
            </Alert>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Hidden field for requestedRole */}
              <input type="hidden" {...register('requestedRole')} value={requestedRole} />

              {/* Justification (Common field) */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Justificativa *
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Explique por que você deseja esse perfil e como pretende contribuir (mínimo 50 caracteres)"
                  className="min-h-32 border-gray-300 focus:border-purple-400"
                  {...register('reason')}
                />
                {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                <p className="text-xs text-gray-500">Mínimo: 50 caracteres</p>
              </div>

              {/* Employee-specific fields */}
              {isEmployee && (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="experience"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <Briefcase className="h-5 w-5" />
                      Experiência Profissional *
                    </Label>
                    <Textarea
                      id="experience"
                      placeholder="Descreva sua experiência na área de beleza, cursos realizados, tempo de atuação, etc. (mínimo 100 caracteres)"
                      className="min-h-32 border-gray-300 focus:border-purple-400"
                      {...register('experience' as never)}
                    />
                    {errors && 'experience' in errors && errors.experience && (
                      <p className="text-sm text-red-500">{String(errors.experience.message)}</p>
                    )}
                    <p className="text-xs text-gray-500">Mínimo: 100 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="certifications"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <Award className="h-5 w-5" />
                      Certificações (Opcional)
                    </Label>
                    <Textarea
                      id="certifications"
                      placeholder="Liste suas certificações, diplomas e formações relevantes"
                      className="min-h-24 border-gray-300 focus:border-purple-400"
                      {...register('certifications' as never)}
                    />
                    {errors && 'certifications' in errors && errors.certifications && (
                      <p className="text-sm text-red-500">
                        {String(errors.certifications.message)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="motivation"
                      className="text-base font-semibold flex items-center gap-2"
                    >
                      <Heart className="h-5 w-5" />
                      Motivação (Opcional)
                    </Label>
                    <Textarea
                      id="motivation"
                      placeholder="O que te motiva a trabalhar na área de beleza?"
                      className="min-h-24 border-gray-300 focus:border-purple-400"
                      {...register('motivation' as never)}
                    />
                  </div>
                </>
              )}

              {/* Admin-specific fields */}
              {!isEmployee && (
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-base font-semibold">
                    Departamento (Opcional)
                  </Label>
                  <Select
                    onValueChange={(value) => setValue('department' as never, value as never)}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-400">
                      <SelectValue placeholder="Selecione um departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Operações</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="it">Tecnologia da Informação</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">Recursos Humanos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    config.color === 'purple'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } text-white font-semibold py-6 text-base`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando solicitação...
                    </>
                  ) : (
                    'Enviar Solicitação'
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">* Campos obrigatórios</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RoleRequestPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}
    >
      <RoleRequestContent />
    </Suspense>
  );
}
