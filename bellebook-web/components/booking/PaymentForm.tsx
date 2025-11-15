'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ amount, bookingId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  // Derive ready state from stripe and elements
  const isReady = !!(stripe && elements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe ainda não foi carregado. Por favor, aguarde.');
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/success?bookingId=${bookingId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Payment failed
        toast.error(error.message || 'Falha no pagamento');
        onError?.(error.message || 'Falha no pagamento');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded without redirect
        toast.success('Pagamento confirmado com sucesso!');
        onSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      toast.error(errorMessage);
      onError?.(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Informações de Pagamento</h3>
        </div>

        {!isReady && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className={!isReady ? 'hidden' : ''}>
          <PaymentElement
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  address: {
                    country: 'BR',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total a pagar</span>
          <span className="text-2xl font-bold text-primary">
            R$ {amount.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando pagamento...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Confirmar Pagamento - R$ {amount.toFixed(2).replace('.', ',')}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Seus dados de pagamento são criptografados e seguros. <br />
        Processado por Stripe.
      </p>
    </form>
  );
}
