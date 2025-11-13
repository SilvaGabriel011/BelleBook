# 🚀 Roadmap de Implementação - BelleBook

## 📋 Visão Geral

Este documento detalha o planejamento para implementar as próximas funcionalidades do BelleBook.

---

## 🎯 Funcionalidades Prioritárias

| # | Funcionalidade | Tempo | Prioridade | Status |
|---|---------------|--------|------------|---------|
| 1 | Tela de Categorias | 2-3h | Alta | ✅ Concluído |
| 2 | Tela de Serviços | 3-4h | Alta | ✅ Concluído |
| 3 | Carrinho | 4-5h | Alta | ✅ Concluído |
| 4 | Agendamento | 4-5h | Alta | ✅ Concluído |
| 5 | Google Calendar | 3-4h | Média | ✅ Concluído |

**Total Estimado:** 16-21 horas

---

## 1️⃣ Tela de Categorias

### 📝 Escopo
- Rota: `/category/[id]`
- Listar serviços de uma categoria
- Filtros por preço e duração
- Ordenação (preço, nome, popularidade)

### 🔧 Backend - Tarefas

```typescript
// 1. Criar módulo de serviços
bellebook-backend/src/services/
├── services.module.ts
├── services.controller.ts
├── services.service.ts
└── dto/
    ├── filter-service.dto.ts
    └── service-response.dto.ts
```

**Endpoints necessários:**
- `GET /api/services/category/:categoryId` - Listar por categoria
- `GET /api/services/:id` - Detalhes do serviço
- `GET /api/services/search` - Buscar serviços

### 🎨 Frontend - Tarefas

```typescript
// Estrutura de arquivos
bellebook-web/
├── app/(dashboard)/category/[id]/
│   └── page.tsx
├── components/
│   ├── ServiceCard.tsx
│   ├── FilterBar.tsx
│   └── SortDropdown.tsx
└── services/
    └── services.service.ts
```

### ✅ Checklist
- [x] Backend: ServicesModule
- [x] Backend: Endpoints CRUD
- [x] Backend: Filtros e ordenação
- [x] Frontend: Página de categoria
- [x] Frontend: ServiceCard component
- [x] Frontend: FilterBar component
- [x] Frontend: Loading states
- [x] Frontend: Empty states
- [ ] Testes: Integração

---

## 2️⃣ Tela de Serviços

### 📝 Escopo
- Rota: `/service/[id]`
- Detalhes completos do serviço
- Galeria de imagens
- Avaliações e média
- Botão adicionar ao carrinho

### 🔧 Backend - Tarefas

**Endpoints necessários:**
- `GET /api/services/:id` - Detalhes com reviews
- `POST /api/favorites` - Adicionar aos favoritos
- `GET /api/services/:id/availability` - Verificar disponibilidade

### 🎨 Frontend - Tarefas

```typescript
// Componentes necessários
├── ImageGallery.tsx       // Carrossel de imagens
├── ReviewSection.tsx      // Lista de avaliações
├── PriceDisplay.tsx       // Exibição de preço/promoção
└── ServiceActions.tsx     // Botões de ação
```

### ✅ Checklist
- [x] Backend: Incluir reviews na query
- [ ] Backend: Sistema de favoritos
- [x] Frontend: Página de detalhes
- [x] Frontend: Galeria de imagens
- [x] Frontend: Seção de reviews
- [x] Frontend: Integração com carrinho
- [x] Frontend: Compartilhamento social
- [ ] SEO: Meta tags

---

## 3️⃣ Implementar Carrinho

### 📝 Escopo
- Rota: `/cart`
- Gerenciamento de itens
- Cálculo de totais
- Aplicação de cupons
- Persistência (localStorage + backend)

### 🔧 Backend - Tarefas

```typescript
// Endpoints do carrinho
POST   /api/cart/item         // Adicionar item
GET    /api/cart               // Obter carrinho
PUT    /api/cart/item/:id      // Atualizar quantidade
DELETE /api/cart/item/:id      // Remover item
POST   /api/cart/coupon        // Aplicar cupom
POST   /api/cart/checkout      // Finalizar carrinho
```

### 🎨 Frontend - Tarefas

```typescript
// Zustand Store
bellebook-web/store/cart.store.ts

// Funcionalidades:
- addItem(service)
- removeItem(itemId)
- updateQuantity(itemId, qty)
- applyCoupon(code)
- clearCart()
- syncWithBackend()
```

### ✅ Checklist
- [x] Backend: CartModule
- [x] Backend: CRUD endpoints
- [x] Backend: Sistema de cupons
- [x] Frontend: Zustand store
- [x] Frontend: Página do carrinho
- [x] Frontend: CartItemCard
- [x] Frontend: Persistência local
- [x] Frontend: Sincronização
- [x] Animações: Add/Remove

---

## 4️⃣ Sistema de Agendamento

### 📝 Escopo
- Rota: `/booking`
- Seleção de data (calendário)
- Seleção de horário (slots)
- Confirmação e pagamento
- Notificações automáticas

### 🔧 Backend - Tarefas

```typescript
// Sistema de disponibilidade
GET  /api/booking/available-slots?date=2024-11-15&serviceId=abc
POST /api/booking                  // Criar agendamento
GET  /api/booking/my-bookings      // Meus agendamentos
PUT  /api/booking/:id/reschedule   // Reagendar
PUT  /api/booking/:id/cancel       // Cancelar
```

**Lógica de disponibilidade:**
1. Definir horários de funcionamento
2. Verificar conflitos de horário
3. Considerar duração do serviço
4. Bloquear slots ocupados

### 🎨 Frontend - Tarefas

```typescript
// Fluxo de agendamento (3 etapas)
1. DateSelection    // Calendário
2. TimeSelection    // Grid de horários
3. Confirmation     // Resumo e pagamento

// Componentes
├── BookingStepper.tsx
├── Calendar.tsx
├── TimeSlotGrid.tsx
└── BookingSummary.tsx
```

### ✅ Checklist
- [x] Backend: BookingModule
- [x] Backend: Algoritmo de slots
- [x] Backend: Validação de conflitos
- [x] Frontend: Página de booking
- [x] Frontend: Calendário
- [x] Frontend: Seletor de horários
- [x] Frontend: Stepper
- [x] Frontend: Confirmação
- [ ] Notificações: Email/WhatsApp

---

## 5️⃣ Integração Google Calendar

### 📝 Escopo
- OAuth 2.0 com Google
- Criar eventos automaticamente
- Sincronização bidirecional
- Lembretes automáticos

### 🔧 Setup Inicial

1. **Google Cloud Console**
   - Criar projeto
   - Habilitar Calendar API
   - Criar credenciais OAuth 2.0

2. **Variáveis de Ambiente**
```env
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 🔧 Backend - Tarefas

```typescript
// google-calendar.service.ts
class GoogleCalendarService {
  - getAuthUrl()           // URL de autorização
  - handleCallback(code)   // Processar callback
  - createEvent(booking)   // Criar evento
  - updateEvent(id, data)  // Atualizar evento
  - deleteEvent(id)        // Deletar evento
}
```

### 🎨 Frontend - Tarefas

```typescript
// Página de integrações
/settings/integrations

// Funcionalidades:
- Conectar Google Calendar
- Status da conexão
- Sincronizar agendamentos
- Configurar lembretes
```

### ✅ Checklist
- [ ] Setup: Google Cloud Console
- [ ] Backend: GoogleCalendarService
- [ ] Backend: OAuth flow
- [ ] Backend: CRUD de eventos
- [ ] Frontend: Página de integrações
- [ ] Frontend: Botão conectar
- [ ] Frontend: Status de sync
- [ ] Testes: Criar/Cancelar eventos

---

## 📊 Priorização e Sequência

### Fase 1: Base (8-10h)
1. **Tela de Categorias** → Base para navegação
2. **Tela de Serviços** → Detalhes e seleção

### Fase 2: Transação (8-10h)
3. **Carrinho** → Gerenciar seleções
4. **Agendamento** → Escolher data/hora

### Fase 3: Integração (3-4h)
5. **Google Calendar** → Sincronização automática

---

## 🚀 Comandos Úteis

### Backend
```bash
# Gerar módulo
nest g module services
nest g controller services
nest g service services

# Rodar migrations
npx prisma migrate dev

# Seed do banco
npm run seed
```

### Frontend
```bash
# Instalar dependências
npm install react-calendar
npm install react-time-picker
npm install @tanstack/react-table

# Gerar componentes Shadcn
npx shadcn add calendar
npx shadcn add table
npx shadcn add tabs
```

---

## 🧪 Testes Recomendados

### Para cada funcionalidade:
1. **Testes unitários** nos services
2. **Testes de integração** nos controllers
3. **Testes E2E** no fluxo completo
4. **Testes de UI** nos componentes críticos

### Cenários importantes:
- Conflito de horários
- Carrinho vazio
- Cupom inválido
- Falha no pagamento
- Indisponibilidade de horário

---

## 📈 Métricas de Sucesso

- **Performance**: Carregamento < 3s
- **UX**: Fluxo de booking em < 5 cliques
- **Confiabilidade**: 0 conflitos de agendamento
- **Conversão**: > 70% dos carrinhos finalizados

---

## 🔗 Recursos e Referências

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Google Calendar API](https://developers.google.com/calendar)
- [Shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 📝 Notas Importantes

1. **Segurança**: Sempre validar disponibilidade no backend
2. **UX**: Mostrar feedback visual em todas ações
3. **Performance**: Implementar cache onde possível
4. **Acessibilidade**: Seguir padrões WCAG 2.1
5. **Mobile**: Garantir responsividade em todas telas

---

**Última atualização:** 12/11/2024
**Autor:** BelleBook Team
**Status:** Em desenvolvimento
