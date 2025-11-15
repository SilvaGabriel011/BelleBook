'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Scissors, Shield, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RoleCard {
  role: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  accessLevel: 'immediate' | 'approval';
  colorClass: string;
  iconBgClass: string;
  buttonClass: string;
}

export default function RoleSelectionPage() {
  const router = useRouter();

  const roleCards: RoleCard[] = [
    {
      role: 'CUSTOMER',
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Cliente',
      description: 'Agende serviços e aproveite nossos tratamentos',
      features: [
        'Agendar serviços de beleza',
        'Acumular pontos de fidelidade',
        'Acessar promoções exclusivas',
        'Histórico de agendamentos',
      ],
      accessLevel: 'immediate',
      colorClass: 'text-pink-600',
      iconBgClass: 'bg-pink-100',
      buttonClass: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    },
    {
      role: 'EMPLOYEE',
      icon: <Scissors className="h-8 w-8" />,
      title: 'Profissional',
      description: 'Ofereça seus serviços e gerencie sua agenda',
      features: [
        'Gerenciar sua agenda de atendimentos',
        'Visualizar seus clientes',
        'Acompanhar seus ganhos',
        'Acesso ao painel profissional',
      ],
      accessLevel: 'approval',
      colorClass: 'text-purple-600',
      iconBgClass: 'bg-purple-100',
      buttonClass:
        'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    },
    {
      role: 'ADMIN',
      icon: <Shield className="h-8 w-8" />,
      title: 'Administrador',
      description: 'Gerencie o sistema e aprove solicitações',
      features: [
        'Gerenciar todos os usuários',
        'Aprovar solicitações de roles',
        'Acessar analytics e relatórios',
        'Configurar o sistema',
      ],
      accessLevel: 'approval',
      colorClass: 'text-blue-600',
      iconBgClass: 'bg-blue-100',
      buttonClass: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    },
  ];

  const handleRoleSelection = (role: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN') => {
    if (role === 'CUSTOMER') {
      // Customer gets immediate access
      router.push('/home');
    } else {
      // Employee and Admin require approval
      router.push(`/role-request?role=${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Perfil
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione o tipo de conta que melhor se adequa às suas necessidades.
            Você poderá solicitar mudanças de perfil posteriormente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleCards.map((card) => (
            <Card
              key={card.role}
              className="relative overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {card.accessLevel === 'immediate' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Acesso Imediato
                  </div>
                </div>
              )}
              {card.accessLevel === 'approval' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Requer Aprovação
                  </div>
                </div>
              )}

              <CardHeader>
                <div className={`${card.iconBgClass} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${card.colorClass}`}>
                  {card.icon}
                </div>
                <CardTitle className="text-2xl">{card.title}</CardTitle>
                <CardDescription className="text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {card.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleRoleSelection(card.role)}
                  className={`w-full ${card.buttonClass} text-white font-semibold py-6 text-base group`}
                >
                  {card.accessLevel === 'immediate' ? (
                    <>
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Solicitar Acesso
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                {card.accessLevel === 'approval' && (
                  <p className="text-xs text-center text-gray-500">
                    Sua solicitação será analisada em até 48 horas
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Tem dúvidas?{' '}
            <a href="/help" className="text-pink-600 hover:underline font-medium">
              Consulte nossa central de ajuda
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
