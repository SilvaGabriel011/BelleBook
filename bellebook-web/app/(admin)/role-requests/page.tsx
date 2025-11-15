'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Scissors,
  User,
  Calendar,
  FileText,
  Check,
  X,
  Loader2,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { roleRequestService } from '@/services/role-request.service';
import type { RoleRequest } from '@/types/role-request.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const fetchRequests = useCallback(async () => {
    try {
      const params: { status?: string; role?: string } = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (roleFilter !== 'all') params.role = roleFilter;

      const data = await roleRequestService.getAllRoleRequests(params);
      setRequests(data.requests || []);
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Erro ao carregar solicitações'
          : 'Erro ao carregar solicitações';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, roleFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setActionLoading(true);
    setError('');

    try {
      await roleRequestService.approveRoleRequest(selectedRequest.id, {
        notes: approvalNotes || undefined,
      });
      setShowApproveDialog(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      await fetchRequests();
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Erro ao aprovar solicitação'
          : 'Erro ao aprovar solicitação';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      setError('O motivo da rejeição é obrigatório');
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      await roleRequestService.rejectRoleRequest(selectedRequest.id, {
        reason: rejectReason,
      });
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
      await fetchRequests();
    } catch (err) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Erro ao rejeitar solicitação'
          : 'Erro ao rejeitar solicitação';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return <Scissors className="h-5 w-5" />;
      case 'ADMIN':
        return <Shield className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      EMPLOYEE: 'Profissional',
      ADMIN: 'Administrador',
      CUSTOMER: 'Cliente',
    };
    return roleNames[role] || role;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      PENDING: { variant: 'default', label: 'Pendente' },
      APPROVED: { variant: 'secondary', label: 'Aprovada' },
      REJECTED: { variant: 'destructive', label: 'Rejeitada' },
    };

    const config = statusConfig[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações de Roles</h1>
          <p className="text-gray-600 mt-1">Gerencie as solicitações de mudança de perfil</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {requests.length} {requests.length === 1 ? 'solicitação' : 'solicitações'}
        </Badge>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="APPROVED">Aprovada</SelectItem>
                <SelectItem value="REJECTED">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label>Role Solicitado</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="EMPLOYEE">Profissional</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma solicitação encontrada
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`${
                        request.requestedRole === 'EMPLOYEE'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-blue-100 text-blue-600'
                      } p-3 rounded-lg`}
                    >
                      {getRoleIcon(request.requestedRole)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{request.user?.name || 'Usuário'}</h3>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {request.user?.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Solicitado em{' '}
                          {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                        <p>
                          <strong>Role atual:</strong> {getRoleDisplayName(request.currentRole)} →{' '}
                          <strong className="text-purple-600">
                            {getRoleDisplayName(request.requestedRole)}
                          </strong>
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                        <FileText className="h-4 w-4 inline mr-1" />
                        {request.requestReason}
                      </p>
                    </div>
                  </div>

                  {request.status === 'PENDING' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowApproveDialog(true);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                          setShowRejectDialog(true);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Details Dialog */}
      <Dialog
        open={!!selectedRequest && !showApproveDialog && !showRejectDialog}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getRoleIcon(selectedRequest.requestedRole)}
                  Solicitação de {getRoleDisplayName(selectedRequest.requestedRole)}
                </DialogTitle>
                <DialogDescription>
                  Enviada por {selectedRequest.user?.name} em{' '}
                  {format(new Date(selectedRequest.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Usuário</Label>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <strong>Nome:</strong> {selectedRequest.user?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedRequest.user?.email}
                    </p>
                    <p>
                      <strong>Membro desde:</strong>{' '}
                      {selectedRequest.user?.createdAt &&
                        format(new Date(selectedRequest.user.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Mudança de Role</Label>
                  <p className="mt-2 text-sm">
                    {getRoleDisplayName(selectedRequest.currentRole)} →{' '}
                    <strong className="text-purple-600">
                      {getRoleDisplayName(selectedRequest.requestedRole)}
                    </strong>
                  </p>
                </div>

                <div>
                  <Label className="text-base font-semibold">Justificativa</Label>
                  <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedRequest.requestReason}
                  </p>
                </div>

                {selectedRequest.experience && (
                  <div>
                    <Label className="text-base font-semibold">Experiência Profissional</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedRequest.experience}
                    </p>
                  </div>
                )}

                {selectedRequest.certifications && (
                  <div>
                    <Label className="text-base font-semibold">Certificações</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedRequest.certifications}
                    </p>
                  </div>
                )}

                {selectedRequest.motivation && (
                  <div>
                    <Label className="text-base font-semibold">Motivação</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedRequest.motivation}
                    </p>
                  </div>
                )}

                {selectedRequest.department && (
                  <div>
                    <Label className="text-base font-semibold">Departamento</Label>
                    <p className="mt-2 text-sm">{selectedRequest.department}</p>
                  </div>
                )}

                {selectedRequest.status !== 'PENDING' && selectedRequest.adminNotes && (
                  <div>
                    <Label className="text-base font-semibold">Notas do Administrador</Label>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'PENDING' && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectDialog(true);
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowApproveDialog(true);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Solicitação</DialogTitle>
            <DialogDescription>
              Você está prestes a aprovar a solicitação de{' '}
              {selectedRequest && getRoleDisplayName(selectedRequest.requestedRole)} para{' '}
              {selectedRequest?.user?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="approvalNotes">Notas (Opcional)</Label>
              <Textarea
                id="approvalNotes"
                placeholder="Adicione notas sobre a aprovação..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-gradient-to-r from-green-500 to-green-600"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aprovando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar Aprovação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Solicitação</DialogTitle>
            <DialogDescription>
              Explique o motivo da rejeição. O usuário receberá um email com esta informação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">Motivo da Rejeição *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Explique por que a solicitação foi rejeitada..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-2 min-h-32"
                required
              />
              {!rejectReason.trim() && (
                <p className="text-xs text-red-500 mt-1">O motivo é obrigatório</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              variant="destructive"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejeitando...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Confirmar Rejeição
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
