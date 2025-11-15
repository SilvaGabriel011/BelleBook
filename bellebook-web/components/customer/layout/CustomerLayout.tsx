'use client';

import { ReactNode, useState } from 'react';
import { Bell, Search, ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BottomNav from './BottomNav';

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  // Mock data - replace with actual API calls and state management
  const [cartCount] = useState(2);
  const [notificationCount] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                BelleBook
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" size="icon" className="relative">
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/40" />
                  <AvatarFallback className="bg-pink-100 text-pink-600">U</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
