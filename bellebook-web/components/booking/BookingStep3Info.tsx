'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const customerInfoSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato: (00) 00000-0000'),
  notes: z.string().optional(),
  emergencyContact: z.string().optional(),
  preferences: z.object({
    whatsapp: z.boolean(),
    email: z.boolean(),
    sms: z.boolean(),
  }),
});

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

export function BookingStep3Info() {
  const { previousStep, nextStep, setCustomerInfo, customerInfo } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CustomerInfoFormData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: customerInfo?.name || '',
      email: customerInfo?.email || '',
      phone: customerInfo?.phone || '',
      notes: customerInfo?.notes || '',
      emergencyContact: customerInfo?.emergencyContact || '',
      preferences: {
        whatsapp: true,
        email: true,
        sms: false,
      },
    },
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted);
  };

  const onSubmit = (data: CustomerInfoFormData) => {
    setCustomerInfo({
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      emergencyContact: data.emergencyContact,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
          <p className="text-sm text-muted-foreground">
            Preencha seus dados para confirmarmos o agendamento
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone/WhatsApp *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                {...register('phone')}
                onChange={handlePhoneChange}
                aria-invalid={!!errors.phone}
                maxLength={15}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Observações (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Alguma informação adicional ou solicitação especial?"
                {...register('notes')}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Ex: Alergias, preferências, necessidades especiais
              </p>
            </div>

            {/* Emergency Contact Field */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">
                Contato de Emergência (opcional)
              </Label>
              <Input
                id="emergencyContact"
                placeholder="Nome e telefone"
                {...register('emergencyContact')}
              />
            </div>

            {/* Communication Preferences */}
            <div className="space-y-3">
              <Label className="text-base">Preferências de Comunicação</Label>
              <p className="text-sm text-muted-foreground">
                Como você gostaria de receber confirmações e lembretes?
              </p>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('preferences.whatsapp')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">WhatsApp (recomendado)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('preferences.email')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Email</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('preferences.sms')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">SMS</span>
                </label>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Seus dados serão utilizados apenas para confirmação e comunicação sobre este agendamento.
              </AlertDescription>
            </Alert>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={previousStep} className="flex-1">
                Voltar
              </Button>
              <Button type="submit" className="flex-1">
                Continuar para Pagamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
