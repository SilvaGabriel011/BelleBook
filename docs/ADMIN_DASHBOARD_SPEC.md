# Dashboard Administrativo - BelleBook

## 1. Visão Geral

Dashboard específico para usuários com role ADMIN, focado em gestão de plataforma, usuários, agendamentos e analytics.

## 2. Estrutura de Navegação

### 2.1. Sidebar Menu

```typescript
interface AdminMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;  // Contador de notificações
}

const adminMenuItems: AdminMenuItem[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard, path: '/admin' },
  { id: 'requests', label: 'Solicitações', icon: UserCheck, path: '/admin/requests', badge: pendingCount },
  { id: 'users', label: 'Usuários', icon: Users, path: '/admin/users' },
  { id: 'employees', label: 'Profissionais', icon: Briefcase, path: '/admin/employees' },
  { id: 'bookings', label: 'Agendamentos', icon: Calendar, path: '/admin/bookings' },
  { id: 'services', label: 'Serviços', icon: Scissors, path: '/admin/services' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/admin/chat', badge: unreadCount },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'settings', label: 'Configurações', icon: Settings, path: '/admin/settings' },
];
```

### 2.2. Header

- Logo BelleBook
- Search bar global
- Notificações (bell icon com badge)
- Perfil admin com dropdown

## 3. Páginas do Dashboard

### 3.1. Overview (/admin)

**KPIs (Cards superiores):**
```typescript
interface DashboardKPI {
  label: string;
  value: number | string;
  change: number;  // Percentual de mudança
  trend: 'up' | 'down';
  icon: LucideIcon;
}

const kpis = [
  { label: 'Usuários Ativos', value: '1,234', change: 12.5, trend: 'up', icon: Users },
  { label: 'Agendamentos Hoje', value: 45, change: -3.2, trend: 'down', icon: Calendar },
  { label: 'Receita Mês', value: 'R$ 25.4k', change: 18.7, trend: 'up', icon: DollarSign },
  { label: 'Solicitações Pendentes', value: 8, change: 0, trend: 'up', icon: Clock },
];
```

**Gráficos:**
- Agendamentos por dia (últimos 30 dias)
- Distribuição de serviços
- Taxa de conversão (visitante → agendamento)

**Ações Rápidas:**
- Aprovar solicitações pendentes
- Ver novos agendamentos
- Responder mensagens urgentes

### 3.2. Solicitações (/admin/requests)

Gerenciamento de role requests.

**Tabela:**
```typescript
interface RoleRequestRow {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
    accountAge: string;  // "Conta criada há 2 dias"
  };
  currentRole: UserRole;
  requestedRole: UserRole;
  requestDate: Date;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  actions: React.ReactNode;
}
```

**Filtros:**
- Status (Pendente, Aprovado, Rejeitado)
- Role solicitado (Employee, Admin)
- Data de solicitação

**Modal de Detalhes:**
- Informações completas do usuário
- Histórico de atividades
- Justificativa completa
- Campos para notas do admin
- Botões: Aprovar | Rejeitar | Solicitar mais informações

**Componente:**
```typescript
// frontend/app/admin/requests/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Check, X, Eye } from 'lucide-react';

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = async (id: string) => {
    await fetch(`/api/role-requests/${id}/approve`, { method: 'PATCH' });
    refreshRequests();
  };

  const handleReject = async (id: string, reason: string) => {
    await fetch(`/api/role-requests/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    refreshRequests();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Solicitações de Conta</h1>
      
      {/* Tabela de solicitações */}
      {/* Modal de detalhes */}
    </div>
  );
}
```

### 3.3. Usuários (/admin/users)

Gestão de todos os usuários (clientes).

**Funcionalidades:**
- Listagem paginada com busca
- Filtros: Status, Data de cadastro, Número de agendamentos
- Ordenação: Nome, Email, Data de cadastro, Última atividade
- Ações: Ver perfil, Suspender, Enviar mensagem, Ver agendamentos

**Colunas:**
- Avatar + Nome
- Email
- Telefone
- Total de agendamentos
- Última atividade
- Status da conta
- Ações

### 3.4. Profissionais (/admin/employees)

Gestão de employees.

**Diferenças da página de Usuários:**
- Coluna de especialidades
- Coluna de avaliação (rating)
- Coluna de disponibilidade
- Total de serviços realizados
- Ações adicionais: Editar agenda, Ver analytics

**Card de Profissional:**
```typescript
interface EmployeeCard {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  rating: number;
  totalServices: number;
  isAvailable: boolean;
  nextAvailableSlot: Date;
}
```

### 3.5. Agendamentos (/admin/bookings)

Visão completa de todos os agendamentos.

**Views:**
- Calendário (semana/mês)
- Lista
- Timeline

**Filtros:**
- Status: Pendente, Confirmado, Concluído, Cancelado
- Profissional
- Serviço
- Data
- Cliente

**Ações:**
- Remarcar agendamento
- Cancelar com notificação
- Ver detalhes completos
- Exportar relatório

**Componente Calendário:**
```typescript
// frontend/components/admin/BookingsCalendar.tsx

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function BookingsCalendar({ bookings }) {
  const events = bookings.map(booking => ({
    id: booking.id,
    title: `${booking.service.name} - ${booking.customer.name}`,
    start: booking.scheduledAt,
    backgroundColor: getStatusColor(booking.status),
    extendedProps: { booking },
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="timeGridWeek"
      events={events}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      eventClick={(info) => openBookingModal(info.event.extendedProps.booking)}
    />
  );
}
```

### 3.6. Chat (/admin/chat)

Sistema de mensagens centralizado.

**Layout:**
- Sidebar esquerda: Lista de conversas
- Centro: Janela de chat
- Direita: Informações do usuário/agendamento

**Features:**
- Chat em tempo real (WebSocket)
- Busca de conversas
- Filtro: Não lidas, Urgentes, Por profissional
- Templates de respostas rápidas
- Anexar arquivos
- Ver histórico completo

**Estrutura:**
```typescript
interface ChatConversation {
  id: string;
  participants: User[];
  lastMessage: {
    text: string;
    sender: User;
    timestamp: Date;
  };
  unreadCount: number;
  relatedBooking?: Booking;
  tags: string[];  // 'urgent', 'complaint', 'rescheduling'
}
```

**Quick Replies:**
```typescript
const quickReplies = [
  'Olá! Como posso ajudar?',
  'Vou verificar isso para você.',
  'Seu agendamento foi confirmado para {DATE} às {TIME}.',
  'Para remarcar, por favor me informe sua preferência de data.',
];
```

### 3.7. Analytics (/admin/analytics)

Dashboards de métricas e relatórios.

**Seções:**

**A. Visão Geral**
- Total de usuários e crescimento
- Revenue total e por período
- Taxa de conversão
- NPS (Net Promoter Score)

**B. Agendamentos**
- Agendamentos por dia/semana/mês
- Taxa de cancelamento
- Horários mais populares
- Serviços mais agendados
- Tempo médio entre agendamento e realização

**C. Profissionais**
- Ranking de profissionais (por avaliação)
- Performance individual
- Taxa de ocupação
- Comparativo de receita

**D. Clientes**
- Novos clientes por período
- Taxa de retenção
- Lifetime Value (LTV)
- Clientes mais ativos
- Motivos de churn

**E. Financeiro**
- Receita por serviço
- Receita por profissional
- Métodos de pagamento
- Taxa de inadimplência
- Projeções

**Gráficos:**
```typescript
// Usar Recharts ou Chart.js

import { LineChart, BarChart, PieChart } from 'recharts';

<LineChart data={revenueData}>
  <Line dataKey="revenue" stroke="#FF6B9D" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</LineChart>
```

### 3.8. Configurações (/admin/settings)

**Tabs:**

**A. Geral**
- Nome da plataforma
- Logo e favicon
- Cores primárias/secundárias
- Fuso horário padrão
- Idioma

**B. Serviços**
- Adicionar/editar/remover serviços
- Categorias
- Preços e duração
- Disponibilidade

**C. Notificações**
- Templates de email
- Configuração WhatsApp Business
- Push notifications
- Frequência de lembretes

**D. Pagamentos**
- Integração Stripe
- Métodos aceitos
- Taxas e comissões
- Política de reembolso

**E. Equipe**
- Gerenciar admins
- Permissões granulares
- Logs de ações administrativas

**F. Avançado**
- Backup e restore
- Logs do sistema
- API keys
- Webhooks

## 4. Componentes Reutilizáveis

### 4.1. StatCard

```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon: LucideIcon;
}

export function StatCard({ label, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className="bg-pink-100 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-pink-600" />
        </div>
      </div>
    </div>
  );
}
```

### 4.2. DataTable

Tabela com sorting, filtering, pagination.

```typescript
interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  pagination?: boolean;
}
```

### 4.3. Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

## 5. Permissões Granulares

### 5.1. Admin Permissions

```typescript
enum AdminPermission {
  // Usuários
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  SUSPEND_USERS = 'suspend_users',
  
  // Profissionais
  VIEW_EMPLOYEES = 'view_employees',
  APPROVE_EMPLOYEES = 'approve_employees',
  EDIT_EMPLOYEES = 'edit_employees',
  
  // Agendamentos
  VIEW_ALL_BOOKINGS = 'view_all_bookings',
  EDIT_BOOKINGS = 'edit_bookings',
  CANCEL_BOOKINGS = 'cancel_bookings',
  
  // Serviços
  MANAGE_SERVICES = 'manage_services',
  
  // Chat
  VIEW_ALL_CHATS = 'view_all_chats',
  
  // Analytics
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_REPORTS = 'export_reports',
  
  // Configurações
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_ADMINS = 'manage_admins',  // Super admin only
}
```

### 5.2. Guard de Permissão

```typescript
// backend/src/auth/guards/permissions.guard.ts

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<AdminPermission[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) return true;

    const { user } = context.switchToHttp().getRequest();
    
    return requiredPermissions.every(permission =>
      user.adminProfile.permissions.includes(permission)
    );
  }
}
```

## 6. Real-time Updates

### 6.1. WebSocket Events

```typescript
// Eventos que o admin deve receber

interface AdminWebSocketEvents {
  'new_booking': Booking;
  'booking_cancelled': { bookingId: string; reason: string };
  'new_role_request': RoleRequest;
  'new_chat_message': ChatMessage;
  'user_activity': { userId: string; action: string };
}

// Cliente WebSocket
const socket = io(process.env.NEXT_PUBLIC_WS_URL);

socket.on('new_role_request', (request) => {
  showNotification(`Nova solicitação de ${request.user.name}`);
  updatePendingCount();
});
```

## 7. Export & Reports

### 7.1. Formatos

- CSV
- Excel (XLSX)
- PDF

### 7.2. Relatórios Disponíveis

- Relatório de agendamentos por período
- Relatório financeiro
- Relatório de performance de profissionais
- Relatório de novos usuários
- Relatório de cancelamentos

```typescript
// backend/src/reports/reports.service.ts

@Injectable()
export class ReportsService {
  async generateBookingsReport(startDate: Date, endDate: Date, format: 'csv' | 'pdf') {
    const bookings = await this.getBookingsInPeriod(startDate, endDate);
    
    if (format === 'csv') {
      return this.generateCSV(bookings);
    } else {
      return this.generatePDF(bookings);
    }
  }
}
```

## 8. Mobile Responsivo

Dashboard deve ser totalmente responsivo:

- Desktop: Sidebar sempre visível
- Tablet: Sidebar colapsável
- Mobile: Menu hambúrguer, navegação bottom sheet

```typescript
// Hook de responsividade

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function AdminLayout({ children }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <div className="flex h-screen">
      {!isMobile || sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

## 9. Audit Log

Registrar todas as ações administrativas:

```typescript
interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Exemplos
{ action: 'APPROVE_ROLE_REQUEST', resource: 'RoleRequest', resourceId: 'req_123' }
{ action: 'SUSPEND_USER', resource: 'User', resourceId: 'user_456' }
{ action: 'CANCEL_BOOKING', resource: 'Booking', resourceId: 'book_789' }
```

---

**Próximo**: Veja `EMPLOYEE_DASHBOARD_SPEC.md` para o dashboard de profissionais.
