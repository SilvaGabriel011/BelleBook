# Dashboard de Profissional (Employee) - BelleBook

## 1. Visão Geral

Dashboard focado em profissionais que prestam serviços, com foco em gerenciamento de agenda, comunicação com clientes e métricas de performance.

## 2. Diferenças Fundamentais vs Cliente

### 2.1. O que NÃO mostrar

❌ **Remover conteúdos de cliente:**
- Promoções e ofertas ("Veja a promoção atual")
- Banners de marketing
- Pacotes para compra
- Sistema de pontos/fidelidade como cliente
- Carrinho de compras
- Busca de serviços para agendar

✅ **Substituir por:**
- Métricas de performance
- Agenda do dia/semana
- Chat com clientes
- Solicitações de agendamento
- Avaliações recebidas

## 3. Estrutura de Navegação

### 3.1. Bottom Navigation (Mobile) / Sidebar (Desktop)

```typescript
const employeeMenuItems = [
  { id: 'home', label: 'Início', icon: Home, path: '/employee' },
  { id: 'schedule', label: 'Agenda', icon: Calendar, path: '/employee/schedule' },
  { id: 'clients', label: 'Clientes', icon: Users, path: '/employee/clients' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/employee/chat', badge: unreadCount },
  { id: 'stats', label: 'Performance', icon: TrendingUp, path: '/employee/stats' },
];
```

## 4. Páginas do Dashboard

### 4.1. Home (/employee)

**Header:**
- Saudação: "Olá, {Nome}! 👋"
- Status: Online/Offline toggle
- Notificações

**Seção 1: Próximos Agendamentos**
```typescript
interface NextBooking {
  id: string;
  customer: {
    name: string;
    avatar: string;
    phone: string;
  };
  service: {
    name: string;
    duration: number;
  };
  scheduledAt: Date;
  status: string;
  notes?: string;
}
```

**Card de Agendamento:**
- Horário grande e destacado
- Nome e foto do cliente
- Serviço e duração
- Botões: Iniciar | Chat | Detalhes | Cancelar

**Seção 2: Resumo do Dia**
```typescript
interface DailySummary {
  totalBookings: number;
  completedToday: number;
  remainingToday: number;
  estimatedRevenue: number;
  averageRating: number;
}
```

**KPI Cards:**
- Agendamentos hoje: 8
- Concluídos: 5/8
- Receita estimada: R$ 540,00
- Avaliação média: 4.8 ⭐

**Seção 3: Ações Rápidas**
- Bloquear horário
- Ver solicitações pendentes
- Ajustar disponibilidade
- Ver histórico

**Seção 4: Últimas Avaliações**
Mostrar últimas 3 avaliações recebidas com comentários.

### 4.2. Agenda (/employee/schedule)

**Views:**
- Dia (timeline vertical)
- Semana (grid)
- Mês (calendário)

**Componente:**
```typescript
// frontend/app/employee/schedule/page.tsx

'use client';

import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function SchedulePage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState([]);

  const handleDateClick = (info) => {
    // Abrir modal para bloquear horário
    openBlockTimeModal(info.dateStr);
  };

  const handleEventClick = (info) => {
    // Abrir detalhes do agendamento
    openBookingDetails(info.event.extendedProps.booking);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minha Agenda</h1>
        
        <div className="flex gap-2">
          <button onClick={() => setView('day')}>Dia</button>
          <button onClick={() => setView('week')}>Semana</button>
          <button onClick={() => setView('month')}>Mês</button>
        </div>
      </div>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView={view === 'week' ? 'timeGridWeek' : 'timeGridDay'}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        headerToolbar={false}
      />
    </div>
  );
}
```

**Funcionalidades:**
- Arrastar para criar bloqueio
- Click no evento para ver detalhes
- Cores por status:
  - Confirmado: Verde
  - Pendente: Amarelo
  - Bloqueado: Cinza
  - Concluído: Azul

**Modal de Bloqueio:**
```typescript
interface BlockTimeModal {
  startTime: Date;
  endTime: Date;
  reason: string;  // "Almoço", "Reunião", "Pessoal"
  recurring?: {
    frequency: 'daily' | 'weekly';
    until: Date;
  };
}
```

**Legenda:**
- 🟢 Confirmado
- 🟡 Aguardando confirmação
- 🔵 Concluído
- ⚫ Bloqueado
- 🔴 Cancelado

### 4.3. Clientes (/employee/clients)

Lista de clientes que já agendaram com o profissional.

**Filtros:**
- Busca por nome/telefone
- Ordenação: Último atendimento, Total de agendamentos, Nome
- Filtro: Ativos, Inativos (>3 meses sem agendar)

**Card de Cliente:**
```typescript
interface ClientCard {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  totalBookings: number;
  lastBooking: Date;
  favoriteServices: string[];
  averageFrequency: string; // "A cada 2 semanas"
  totalSpent: number;
  notes?: string;  // Notas privadas do profissional
}
```

**Ações:**
- Ver histórico completo
- Enviar mensagem
- Adicionar nota privada
- Ver preferências

**Estatísticas do Cliente:**
- Total gasto
- Frequência média
- Serviços favoritos
- Última visita
- Próximo agendamento

### 4.4. Chat (/employee/chat)

Chat 1-on-1 com clientes que agendaram.

**Layout:**
- Lista de conversas à esquerda
- Janela de chat à direita
- Info do cliente na sidebar

**Features:**
- Busca de conversas
- Filtro: Não lidas, Relacionadas a agendamentos
- Templates de resposta rápida
- Anexar imagens
- Enviar localização do estabelecimento
- Botões de ação rápida:
  - Remarcar agendamento
  - Ver agendamento relacionado
  - Chamar no WhatsApp

**Quick Replies:**
```typescript
const quickReplies = [
  'Olá! Tudo bem?',
  'Confirmo seu agendamento para {DATE} às {TIME}',
  'Preciso remarcar. Você tem disponibilidade em outro horário?',
  'Por favor, chegue 10 minutos antes do horário agendado',
  'Seu serviço está concluído! Foi um prazer atendê-la 😊',
];
```

**Integração WhatsApp:**
- Botão para abrir conversa no WhatsApp
- Sincronização de mensagens (opcional)

### 4.5. Performance (/employee/stats)

Métricas e analytics pessoais.

**Período selecionável:**
- Última semana
- Último mês
- Últimos 3 meses
- Ano atual

**Seção 1: Visão Geral**
```typescript
interface PerformanceOverview {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowRate: number;
  totalRevenue: number;
  averageTicket: number;
  averageRating: number;
  totalReviews: number;
}
```

**Gráficos:**

**A. Receita ao Longo do Tempo**
- Gráfico de linha
- Comparativo com período anterior
- Meta mensal (se configurada)

**B. Agendamentos por Serviço**
- Gráfico de pizza
- Top 5 serviços mais realizados

**C. Horários Mais Populares**
- Heatmap de disponibilidade
- Identifica melhores horários para maximizar agenda

**D. Taxa de Ocupação**
- % de horários disponíveis vs ocupados
- Por dia da semana

**Seção 2: Avaliações**
- Distribuição de estrelas (gráfico de barras)
- Evolução da avaliação média ao longo do tempo
- Últimas avaliações com comentários
- Palavras mais mencionadas (word cloud)

**Seção 3: Clientes**
- Novos clientes no período
- Clientes recorrentes
- Taxa de retenção
- Top 10 clientes (por valor gasto)

**Seção 4: Comparativo**
Se houver outros profissionais:
- Sua posição no ranking
- Comparativo de avaliação média
- Comparativo de volume de agendamentos

**Export:**
- Relatório em PDF
- Dados em CSV

### 4.6. Perfil (/employee/profile)

Configurações e informações pessoais.

**Seções:**

**A. Informações Básicas**
- Foto de perfil
- Nome
- Email
- Telefone
- Bio profissional (visível para clientes)

**B. Especialidades**
```typescript
interface Specialty {
  id: string;
  name: string;
  category: string;
  certified: boolean;
  yearsOfExperience: number;
}
```

Checkboxes:
- ☑️ Manicure
- ☑️ Pedicure
- ☑️ Design de Sobrancelhas
- ☐ Extensão de Cílios
- ☑️ Depilação

**C. Portfólio**
- Upload de fotos de trabalhos realizados
- Galeria visual
- Máximo 20 fotos

**D. Disponibilidade**
```typescript
interface WeekSchedule {
  [key: string]: {
    enabled: boolean;
    slots: { start: string; end: string }[];
  };
}

// Exemplo
{
  monday: { 
    enabled: true, 
    slots: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  tuesday: { enabled: true, slots: [...] },
  // ...
}
```

Toggle para cada dia da semana + horários.

**E. Configurações de Notificação**
- ✅ Novo agendamento
- ✅ Cancelamento
- ✅ Mensagem de cliente
- ✅ Lembrete 1h antes
- ☐ Relatório semanal

**F. Conta**
- Trocar senha
- Configurar pagamento (PIX, dados bancários)
- Termos de uso
- Política de privacidade

## 5. Componentes Específicos

### 5.1. BookingCard

```typescript
interface BookingCardProps {
  booking: NextBooking;
  onStart: () => void;
  onChat: () => void;
  onCancel: () => void;
}

export function BookingCard({ booking, onStart, onChat, onCancel }: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {format(booking.scheduledAt, 'HH:mm')}
          </p>
          <p className="text-sm text-gray-600">
            {format(booking.scheduledAt, "dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          CONFIRMADO
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <img
          src={booking.customer.avatar}
          alt={booking.customer.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-900">{booking.customer.name}</p>
          <p className="text-sm text-gray-600">{booking.service.name}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onStart}
          className="flex-1 bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600"
        >
          Iniciar
        </button>
        <button
          onClick={onChat}
          className="px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 5.2. ClientListItem

```typescript
export function ClientListItem({ client }: { client: ClientCard }) {
  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-3">
        <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-semibold text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-600">{client.phone}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {client.totalBookings} agendamentos
        </p>
        <p className="text-xs text-gray-600">
          Última visita: {formatDistanceToNow(client.lastBooking, { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}
```

### 5.3. StatCard (Employee version)

```typescript
export function EmployeeStatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 text-pink-600" />
        {change && (
          <span className={`text-xs font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
```

## 6. Notificações Push

### 6.1. Tipos de Notificação

```typescript
enum EmployeeNotificationType {
  NEW_BOOKING = 'new_booking',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_RESCHEDULED = 'booking_rescheduled',
  NEW_MESSAGE = 'new_message',
  NEW_REVIEW = 'new_review',
  REMINDER_1H = 'reminder_1h',
  REMINDER_15M = 'reminder_15m',
}
```

### 6.2. Templates

**Novo Agendamento:**
```
🎉 Novo agendamento!
{CUSTOMER_NAME} agendou {SERVICE} para {DATE} às {TIME}
```

**Cancelamento:**
```
⚠️ Agendamento cancelado
{CUSTOMER_NAME} cancelou o agendamento de {SERVICE} ({DATE} {TIME})
```

**Nova Mensagem:**
```
💬 Nova mensagem de {CUSTOMER_NAME}
{MESSAGE_PREVIEW}
```

**Nova Avaliação:**
```
⭐ Nova avaliação!
{CUSTOMER_NAME} avaliou seu serviço com {STARS} estrelas
```

## 7. Fluxo de Agendamento (Employee POV)

### 7.1. Estados

1. **Solicitação Recebida** (PENDING)
   - Cliente fez o agendamento
   - Employee recebe notificação
   - Pode aceitar ou recusar

2. **Confirmado** (CONFIRMED)
   - Employee aceitou
   - Aparece na agenda
   - Cliente recebe confirmação

3. **Em Andamento** (IN_PROGRESS)
   - Employee clicou em "Iniciar"
   - Timer ativo (opcional)

4. **Concluído** (COMPLETED)
   - Employee clicou em "Finalizar"
   - Solicita avaliação ao cliente

5. **Cancelado** (CANCELLED)
   - Por employee ou cliente
   - Requer motivo

### 7.2. Ações Permitidas

**Antes do agendamento:**
- Aceitar/Recusar solicitação
- Enviar mensagem
- Remarcar (propor novo horário)
- Cancelar (com motivo)

**Durante o agendamento:**
- Iniciar serviço
- Pausar (se necessário)
- Adicionar notas privadas
- Adicionar produtos utilizados (para estoque)

**Após o agendamento:**
- Marcar como concluído
- Solicitar avaliação
- Ver feedback do cliente

## 8. Regras de Negócio

### 8.1. Aceitação de Agendamentos

- Employee tem 24h para aceitar/recusar
- Se não responder, agendamento expira automaticamente
- Pode configurar aceitação automática

### 8.2. Cancelamento

- Até 24h antes: sem penalidade
- Menos de 24h: pode afetar rating
- No-show do cliente: pode bloquear cliente

### 8.3. Disponibilidade

- Horários bloqueados ficam indisponíveis
- Pode configurar buffer entre agendamentos (15min)
- Máximo X agendamentos simultâneos (padrão: 1)

## 9. Integrações

### 9.1. WhatsApp Business

- Notificações via WhatsApp
- Resposta rápida por WhatsApp
- Histórico sincronizado (opcional)

### 9.2. Google Calendar

- Sincronização bidirecional
- Bloqueios automáticos
- Lembretes

### 9.3. Pagamentos

- Ver receita por agendamento
- Dashboard financeiro
- Histórico de pagamentos
- Opção de saque (se aplicável)

## 10. Onboarding

Quando account é aprovada, employee passa por:

1. **Boas-vindas** - Vídeo explicativo
2. **Completar Perfil** - Foto, bio, especialidades
3. **Configurar Agenda** - Horários disponíveis
4. **Upload de Portfólio** - Mínimo 3 fotos
5. **Tour Guiado** - Walkthrough das features
6. **Primeiro Agendamento** - Incentivo a marcar disponibilidade

## 11. Mobile First

Dashboard employee deve ser **100% funcional no mobile**:

- Gestos: Swipe para ações rápidas
- Notificações push essenciais
- Design adaptável para uso com uma mão
- Acesso rápido às funções mais usadas
- Modo offline para visualização (sync quando online)

---

**Conclusão**: O dashboard de employee é focado em **produtividade** e **comunicação eficiente** com clientes, eliminando elementos promocionais que só fazem sentido para o perfil de cliente.
