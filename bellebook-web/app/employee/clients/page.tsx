'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users } from 'lucide-react';
import { ClientListItem } from '@/components/employee/ClientListItem';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { employeeApi } from '@/services/employee-api';
import type { ClientCard } from '@/types/employee';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<'lastBooking' | 'totalBookings' | 'name'>('lastBooking');
  const [filter, setFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const [clients, setClients] = useState<ClientCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await employeeApi.getClients({
        search: search || undefined,
        orderBy,
        filter,
      });
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search, orderBy, filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [fetchClients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seu relacionamento com clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <Users className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastBooking">Último Atendimento</SelectItem>
                <SelectItem value="totalBookings">Total de Agendamentos</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="totalSpent">Valor Gasto</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos (últimos 3 meses)</SelectItem>
                <SelectItem value="inactive">Inativos (&gt;3 meses)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Clientes Ativos</p>
            <p className="text-2xl font-bold text-green-600">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Novos este Mês</p>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Taxa de Retenção</p>
            <p className="text-2xl font-bold text-purple-600">85%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Ticket Médio</p>
            <p className="text-2xl font-bold text-pink-600">R$ 127</p>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      {clients.length > 0 ? (
        <div className="space-y-3">
          {clients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onClick={() => console.log('View client', client.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              Nenhum cliente encontrado
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tente ajustar seus filtros ou busca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
