'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancelledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const handleRetryPayment = () => {
    if (bookingId) {
      router.push(`/customer/booking/${bookingId}/payment`);
    } else {
      router.push('/customer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>

          {/* Cancel Message */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Pagamento Cancelado</h1>
            <p className="text-gray-600">
              O pagamento não foi concluído. Não se preocupe, nenhum valor foi cobrado.
            </p>
          </div>

          {/* Info Message */}
          <div className="mb-6 rounded-lg bg-amber-50 p-4">
            <h3 className="mb-2 font-medium text-amber-900">O que aconteceu?</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• O pagamento foi interrompido antes de ser concluído</li>
              <li>• Nenhuma cobrança foi realizada</li>
              <li>• Seu agendamento não foi confirmado</li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="mb-6 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 font-medium text-gray-900">Precisa de ajuda?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Se você enfrentou algum problema durante o pagamento, entre em contato conosco:</p>
              <div className="flex flex-col gap-1">
                <p>📧 Email: suporte@bellebook.com</p>
                <p>📱 WhatsApp: (11) 99999-9999</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleRetryPayment} className="flex-1" variant="default">
              <RotateCw className="mr-2 h-5 w-5" />
              Tentar Novamente
            </Button>
            <Button onClick={() => router.push('/customer')} className="flex-1" variant="outline">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para Home
            </Button>
          </div>

          {/* Additional Info */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Seus dados estão seguros. Utilizamos criptografia de ponta a ponta para proteger suas
            informações.
          </p>
        </div>
      </div>
    </div>
  );
}
