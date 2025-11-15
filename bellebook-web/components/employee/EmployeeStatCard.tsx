'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EmployeeStatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export function EmployeeStatCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
}: EmployeeStatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-6 h-6 text-pink-600" />
          {change !== undefined && (
            <div
              className={`flex items-center text-xs font-semibold ${
                trend === 'up' || change > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' || change > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </CardContent>
    </Card>
  );
}
