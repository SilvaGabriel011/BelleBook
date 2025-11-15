'use client';

import { Gift, Share2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LoyaltyCardProps {
  points?: number;
  nextRewardPoints?: number;
}

export default function LoyaltyCard({ points = 250, nextRewardPoints = 500 }: LoyaltyCardProps) {
  const progress = (points / nextRewardPoints) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-none">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Programa de Fidelidade</h3>
          </div>
          <p className="text-sm text-pink-100">Ganhe pontos e recompensas!</p>
        </div>
        <TrendingUp className="h-8 w-8 text-yellow-300" />
      </div>

      {/* Points Display with Circular Progress */}
      <div className="relative flex items-center justify-center my-8">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(progress / 100) * 352} 352`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{points}</span>
          <span className="text-sm text-pink-100">pontos</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-pink-100 mb-2">
          Faltam {nextRewardPoints - points} pontos para sua próxima recompensa
        </p>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href="/rewards" className="flex-1">
          <Button
            variant="secondary"
            className="w-full bg-white text-purple-600 hover:bg-pink-50 font-semibold"
          >
            Ver Recompensas
          </Button>
        </Link>
        <Button variant="outline" className="border-white text-white hover:bg-white/10" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Referral CTA */}
      <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
        <p className="text-sm text-center">
          🎉 Indique uma amiga e ganhe <span className="font-bold">+100 pontos</span>
        </p>
      </div>
    </Card>
  );
}
