'use client';

import { useState } from 'react';
import { Camera, Save, Bell, Clock, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Profissional BelleBook',
    email: 'profissional@bellebook.com',
    phone: '(11) 98765-4321',
    bio: 'Especialista em beleza com mais de 5 anos de experiência.',
    avatar: null as string | null,
  });

  const specialties = [
    { id: '1', name: 'Manicure', selected: true },
    { id: '2', name: 'Pedicure', selected: true },
    { id: '3', name: 'Design de Sobrancelhas', selected: true },
    { id: '4', name: 'Extensão de Cílios', selected: false },
    { id: '5', name: 'Depilação', selected: true },
  ];

  const weekDays = [
    { id: 'monday', name: 'Segunda', enabled: true },
    { id: 'tuesday', name: 'Terça', enabled: true },
    { id: 'wednesday', name: 'Quarta', enabled: true },
    { id: 'thursday', name: 'Quinta', enabled: true },
    { id: 'friday', name: 'Sexta', enabled: true },
    { id: 'saturday', name: 'Sábado', enabled: false },
    { id: 'sunday', name: 'Domingo', enabled: false },
  ];

  const notifications = [
    { id: '1', label: 'Novo agendamento', enabled: true },
    { id: '2', label: 'Cancelamento', enabled: true },
    { id: '3', label: 'Mensagem de cliente', enabled: true },
    { id: '4', label: 'Lembrete 1h antes', enabled: true },
    { id: '5', label: 'Relatório semanal', enabled: false },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações e configurações
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className="bg-pink-100 text-pink-700 text-2xl">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG ou GIF. Máx 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio Profissional</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Conte um pouco sobre sua experiência..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta descrição será visível para os clientes
                </p>
              </div>

              <Button className="bg-pink-500 hover:bg-pink-600">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Badge
                    key={specialty.id}
                    variant={specialty.selected ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      specialty.selected
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {specialty.selected ? '✓ ' : ''}
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weekDays.map((day) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      className="w-4 h-4 text-pink-500"
                    />
                    <span className="font-medium">{day.name}</span>
                  </div>
                  {day.enabled && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-600">09:00 - 12:00</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-600">14:00 - 18:00</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <span className="text-sm">{notif.label}</span>
                  <input
                    type="checkbox"
                    checked={notif.enabled}
                    className="w-4 h-4 text-pink-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de Avaliações</span>
                <span className="font-bold">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avaliação Média</span>
                <span className="font-bold text-yellow-600">4.9 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total de Serviços</span>
                <span className="font-bold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Clientes Ativos</span>
                <span className="font-bold text-green-600">24</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Trocar Senha
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Dados Bancários
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Termos de Uso
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
