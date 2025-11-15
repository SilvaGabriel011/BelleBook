'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, Users, MessageSquare, TrendingUp, User } from 'lucide-react';

const menuItems = [
  { id: 'home', label: 'Início', icon: Home, path: '/employee' },
  { id: 'schedule', label: 'Agenda', icon: Calendar, path: '/employee/schedule' },
  { id: 'clients', label: 'Clientes', icon: Users, path: '/employee/clients' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/employee/chat' },
  { id: 'stats', label: 'Performance', icon: TrendingUp, path: '/employee/stats' },
  { id: 'profile', label: 'Perfil', icon: User, path: '/employee/profile' },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              BelleBook Pro
            </h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? 'bg-pink-50 text-pink-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  isActive ? 'text-pink-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
