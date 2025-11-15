'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/store/booking.store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProgressIndicator from '@/components/booking/ProgressIndicator';
import { BookingStep1Cart } from '@/components/booking/BookingStep1Cart';
import { BookingStep2Schedule } from '@/components/booking/BookingStep2Schedule';
import { BookingStep3Info } from '@/components/booking/BookingStep3Info';
import { BookingStep4Payment } from '@/components/booking/BookingStep4Payment';
import { BookingStep5Confirmation } from '@/components/booking/BookingStep5Confirmation';

const STEP_TITLES = [
  'Carrinho',
  'Data e Horário',
  'Informações',
  'Pagamento',
  'Confirmação',
];

export default function BookingPage() {
  const router = useRouter();
  const { currentStep, totalSteps } = useBookingStore();

  useEffect(() => {
    const saveState = () => {
      const state = useBookingStore.getState();
      localStorage.setItem('bookingState', JSON.stringify({
        currentStep: state.currentStep,
        services: state.services,
        providerId: state.providerId,
        providerName: state.providerName,
        scheduledAt: state.scheduledAt,
        customerInfo: state.customerInfo,
        paymentMethod: state.paymentMethod,
        promoCode: state.promoCode,
      }));
    };

    const unsubscribe = useBookingStore.subscribe(saveState);

    const savedState = localStorage.getItem('bookingState');
    if (savedState && currentStep === 1) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.currentStep > 1) {
          console.log('Saved state available:', parsed);
        }
      } catch (error) {
        console.error('Error restoring booking state:', error);
      }
    }

    return () => {
      unsubscribe();
    };
  }, [currentStep]);

  useEffect(() => {
    const handlePopState = () => {
      if (currentStep > 1 && currentStep < 5) {
        window.history.pushState(null, '', window.location.href);
        useBookingStore.getState().previousStep();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/home');
    } else if (currentStep < 5) {
      useBookingStore.getState().previousStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BookingStep1Cart />;
      case 2:
        return <BookingStep2Schedule />;
      case 3:
        return <BookingStep3Info />;
      case 4:
        return <BookingStep4Payment />;
      case 5:
        return <BookingStep5Confirmation />;
      default:
        return <BookingStep1Cart />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep < 5 && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {currentStep === 5 ? 'Agendamento Confirmado!' : 'Novo Agendamento'}
                </h1>
                {currentStep < 5 && (
                  <p className="text-sm text-muted-foreground">
                    Passo {currentStep} de {totalSteps - 1}: {STEP_TITLES[currentStep - 1]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      {currentStep < 5 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps - 1}
            steps={STEP_TITLES.slice(0, -1)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </main>

      {/* Footer Info */}
      {currentStep < 5 && (
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Confirmação Imediata</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Lembretes Automáticos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Cancelamento até 24h antes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Pagamento Seguro</span>
              </div>
            </div>
          </Card>
        </footer>
      )}
    </div>
  );
}
