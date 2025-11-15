'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { number: 1, title: 'Carrinho', description: 'Revisar serviços' },
  { number: 2, title: 'Agendamento', description: 'Escolher horário' },
  { number: 3, title: 'Informações', description: 'Seus dados' },
  { number: 4, title: 'Pagamento', description: 'Forma de pagamento' },
  { number: 5, title: 'Confirmação', description: 'Finalizar' },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full py-6">
      {/* Mobile: Simple Progress Bar */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Etapa {currentStep} de {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#FF6B9D] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Full Stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                      isCompleted &&
                        'bg-[#FF6B9D] text-white',
                      isActive &&
                        'bg-[#FF6B9D] text-white ring-4 ring-[#FFC8DD]',
                      !isCompleted &&
                        !isActive &&
                        'bg-gray-200 text-gray-500'
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                  </div>

                  {/* Text */}
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        (isActive || isCompleted) ? 'text-[#FF6B9D]' : 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4 transition-all duration-300',
                      isCompleted ? 'bg-[#FF6B9D]' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
