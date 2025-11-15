'use client';

import { useState } from 'react';
import { CreditCard, Banknote, QrCode, Gift, Shield, Lock } from 'lucide-react';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PaymentWrapper } from './PaymentWrapper';

type PaymentMethodType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH' | 'LOYALTY_POINTS';

interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  requiresPoints?: boolean;
}

export function BookingStep4Payment() {
  const { previousStep, nextStep, setPaymentMethod, totalAmount, subtotal, discount } =
    useBookingStore();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('CREDIT_CARD');
  const [showStripeForm, setShowStripeForm] = useState(false);

  const userLoyaltyPoints = 0; // TODO: Get from user profile
  const pointsValue = userLoyaltyPoints * 0.01; // Each point = R$ 0.01

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'CREDIT_CARD',
      label: 'Cartão de Crédito',
      description: 'Pagamento seguro via Stripe',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 'DEBIT_CARD',
      label: 'Cartão de Débito',
      description: 'Pagamento seguro via Stripe',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 'PIX',
      label: 'Pix',
      description: 'Em breve - Pagamento instantâneo',
      icon: <QrCode className="w-5 h-5" />,
      disabled: true,
    },
    {
      id: 'CASH',
      label: 'Pagar no Local',
      description: 'Dinheiro ou cartão no estabelecimento',
      icon: <Banknote className="w-5 h-5" />,
    },
    {
      id: 'LOYALTY_POINTS',
      label: 'Usar Pontos de Fidelidade',
      description: `Você tem ${userLoyaltyPoints} pontos (R$ ${pointsValue.toFixed(2)})`,
      icon: <Gift className="w-5 h-5" />,
      disabled: userLoyaltyPoints < 100 || pointsValue < totalAmount,
      requiresPoints: true,
    },
  ];

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value as PaymentMethodType);
    setShowStripeForm(false);
  };

  const handleContinue = () => {
    if (selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') {
      setShowStripeForm(true);
    } else {
      setPaymentMethod(selectedMethod);
      nextStep();
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentMethod(selectedMethod);
    nextStep();
  };

  if (showStripeForm) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => setShowStripeForm(false)} className="mb-4">
              ← Voltar para métodos de pagamento
            </Button>
          </div>
          <PaymentWrapper
            bookingId="temp-booking-id"
            amount={totalAmount}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              console.error('Payment error:', error);
              setShowStripeForm(false);
            }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
          <p className="text-sm text-muted-foreground">Escolha como deseja pagar pelo serviço</p>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`relative flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${method.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    disabled={method.disabled}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={method.id}
                      className={`flex items-center gap-2 font-medium ${
                        method.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      {method.icon}
                      {method.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                    {method.requiresPoints && userLoyaltyPoints < 100 && (
                      <p className="text-xs text-destructive mt-1">
                        Mínimo de 100 pontos necessários
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhes do Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedMethod === 'CASH' && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Pagamento no Local:</strong> Você poderá pagar em dinheiro ou cartão
                diretamente no estabelecimento no dia do serviço.
              </p>
            </div>
          )}

          {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Pagamento Online:</strong> Você será redirecionado para o formulário seguro
                de pagamento da Stripe.
              </p>
            </div>
          )}

          {selectedMethod === 'LOYALTY_POINTS' && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Pontos de Fidelidade:</strong> Serão descontados{' '}
                {Math.ceil(totalAmount / 0.01)} pontos da sua conta. Saldo restante:{' '}
                {userLoyaltyPoints - Math.ceil(totalAmount / 0.01)} pontos.
              </p>
            </div>
          )}

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Desconto</span>
                <span>- R$ {discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total a Pagar</span>
              <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Badge */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>SSL Criptografado</span>
            </div>
          </div>
          {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
            <p className="text-center text-xs text-muted-foreground mt-2">Powered by Stripe</p>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={previousStep} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleContinue} className="flex-1">
              {selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD'
                ? 'Ir para Pagamento'
                : 'Confirmar Agendamento'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
