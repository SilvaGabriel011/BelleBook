'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Package, Award } from 'lucide-react';

export default function ProfilePage() {
  // Mock user data - replace with actual user data from API/auth
  const user = {
    name: 'Maria Silva',
    email: 'maria.silva@example.com',
    phone: '+55 11 98765-4321',
    address: 'São Paulo, SP',
    joinDate: 'Janeiro 2024',
    points: 150,
    activePackages: 2,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        {/* Profile Card */}
        <Card className="border-pink-200">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-pink-600 text-white text-2xl">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-pink-100">Cliente desde {user.joinDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-pink-50 rounded-lg p-4 text-center border border-pink-200">
                <Award className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-pink-600">{user.points}</p>
                <p className="text-sm text-gray-600">Pontos de Fidelidade</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{user.activePackages}</p>
                <p className="text-sm text-gray-600">Pacotes Ativos</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">5</p>
                <p className="text-sm text-gray-600">Agendamentos</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Nome Completo</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Localização</p>
                    <p className="font-medium text-gray-900">{user.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="flex-1 bg-pink-500 hover:bg-pink-600">Editar Perfil</Button>
              <Button
                variant="outline"
                className="flex-1 border-pink-500 text-pink-500 hover:bg-pink-50"
              >
                Meus Pacotes
              </Button>
              <Button variant="outline" className="flex-1 border-gray-300">
                Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Agendamentos</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Package className="h-5 w-5" />
                <span className="text-xs">Meus Pacotes</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Award className="h-5 w-5" />
                <span className="text-xs">Pontos</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <User className="h-5 w-5" />
                <span className="text-xs">Indicar Amigo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
