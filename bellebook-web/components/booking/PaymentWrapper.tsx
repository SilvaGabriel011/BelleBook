'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { PaymentForm } from './PaymentForm';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

interface PaymentWrapperProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentWrapper({ bookingId, amount, onSuccess, onError }: PaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');

        const response = await axios.post(
          `${API_URL}/payments/create-intent`,
          {
            bookingId,
            amount,
            metadata: {
              bookingId,
              source: 'web',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(response.data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Erro ao inicializar pagamento. Por favor, tente novamente.');
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingId, amount]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Preparando pagamento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!clientSecret) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao inicializar pagamento. Por favor, recarregue a página.
        </AlertDescription>
      </Alert>
    );
  }

  const stripePromise = getStripe();

  if (!stripePromise) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Pagamentos não estão configurados. Entre em contato com o suporte.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#FF6B9D',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
        locale: 'pt-BR',
      }}
    >
      <PaymentForm amount={amount} bookingId={bookingId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
