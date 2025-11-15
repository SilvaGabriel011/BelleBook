import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon: LucideIcon;
}

export function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p
              className={`text-sm mt-3 flex items-center gap-1 ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span className="font-semibold">{trend === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </p>
          )}
        </div>
        <div className="bg-pink-100 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-pink-600" />
        </div>
      </div>
    </div>
  );
}
