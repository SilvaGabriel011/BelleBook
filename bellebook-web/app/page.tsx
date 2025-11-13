'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há token de autenticação
    const token = localStorage.getItem('token');
    
    if (token) {
      // Se autenticado, redirecionar para home
      router.push('/home');
    } else {
      // Se não autenticado, redirecionar para login
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando BelleBook...</p>
      </div>
    </div>
  );
}
