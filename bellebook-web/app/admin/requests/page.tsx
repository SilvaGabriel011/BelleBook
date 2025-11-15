'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { adminApi } from '@/services/admin-api';

interface RoleRequest {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string | null;
    createdAt: string;
  };
  currentRole: string;
  requestedRole: string;
  requestReason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await adminApi.roleRequests.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error('Error loading role requests:', error);
      // Fallback to mock data for development
      setRequests([
        {
          id: '1',
          user: {
            name: 'Maria Silva',
            email: 'maria@example.com',
            avatar: null,
            createdAt: '2024-01-10T10:00:00Z',
          },
          currentRole: 'CUSTOMER',
          requestedRole: 'EMPLOYEE',
          requestReason: 'Sou manicure profissional com 5 anos de experiência e gostaria de oferecer meus serviços na plataforma.',
          status: 'PENDING',
          createdAt: '2024-01-15T14:30:00Z',
        },
        {
          id: '2',
          user: {
            name: 'João Santos',
            email: 'joao@example.com',
            avatar: null,
            createdAt: '2024-01-05T08:00:00Z',
          },
          currentRole: 'CUSTOMER',
          requestedRole: 'EMPLOYEE',
          requestReason: 'Trabalho com design de sobrancelhas há 3 anos e tenho certificação.',
          status: 'PENDING',
          createdAt: '2024-01-14T16:20:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Tem certeza que deseja aprovar esta solicitação?')) return;

    try {
      await adminApi.roleRequests.approve(id);
      await loadRequests(); // Reload the list
      setSelectedRequest(null);
      alert('Solicitação aprovada com sucesso!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Erro ao aprovar solicitação. Tente novamente.');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Por favor, informe o motivo da rejeição:');
    if (!reason) return;

    try {
      await adminApi.roleRequests.reject(id, reason);
      await loadRequests(); // Reload the list
      setSelectedRequest(null);
      alert('Solicitação rejeitada com sucesso!');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Erro ao rejeitar solicitação. Tente novamente.');
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const columns = [
    {
      key: 'user',
      label: 'Usuário',
      render: (user: RoleRequest['user']) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-semibold">
            {user.name[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'currentRole',
      label: 'Role Atual',
      render: (role: string) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
          {role}
        </span>
      ),
    },
    {
      key: 'requestedRole',
      label: 'Role Solicitado',
      render: (role: string) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {role}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: string) => {
        const colors = {
          PENDING: 'bg-yellow-100 text-yellow-700',
          APPROVED: 'bg-green-100 text-green-700',
          REJECTED: 'bg-red-100 text-red-700',
        };
        return (
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Data',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, row: RoleRequest) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRequest(row);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(row.id);
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Aprovar"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(row.id);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Rejeitar"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações de Conta</h1>
          <p className="text-gray-600 mt-1">Gerencie solicitações de mudança de role</p>
        </div>

        <div className="flex gap-2">
          {(['all', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === f
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {f === 'all' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">
                {requests.filter(r => r.status === 'PENDING').length}
              </p>
              <p className="text-sm text-yellow-700">Pendentes</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <Check className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">
                {requests.filter(r => r.status === 'APPROVED').length}
              </p>
              <p className="text-sm text-green-700">Aprovadas</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-3">
            <X className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-900">
                {requests.filter(r => r.status === 'REJECTED').length}
              </p>
              <p className="text-sm text-red-700">Rejeitadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <DataTable
        data={filteredRequests}
        columns={columns}
        onRowClick={(row) => setSelectedRequest(row)}
      />

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Detalhes da Solicitação</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">Informações do Usuário</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Nome:</span> {selectedRequest.user.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.user.email}</p>
                  <p><span className="font-medium">Conta criada em:</span> {new Date(selectedRequest.user.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">Detalhes da Solicitação</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Role Atual:</span> {selectedRequest.currentRole}</p>
                  <p><span className="font-medium">Role Solicitado:</span> {selectedRequest.requestedRole}</p>
                  <p><span className="font-medium">Data da Solicitação:</span> {new Date(selectedRequest.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3">Justificativa</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedRequest.requestReason}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Aprovar Solicitação
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Rejeitar Solicitação
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
