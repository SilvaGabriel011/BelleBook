# 🌐 BelleBook - Roadmap Web-First

## 📋 Estratégia: Web Primeiro, Mobile Depois

**Decisão:** Construir uma aplicação web completa e funcional ANTES de adaptar para mobile.

**Por quê?**
- ✅ Desenvolvimento mais rápido
- ✅ Debug mais fácil no navegador
- ✅ Melhor experiência de desenvolvimento
- ✅ Depois apenas adaptar responsividade para mobile

---

## 🎯 Visão Geral

**BelleBook** é uma plataforma de agendamento de serviços de beleza com foco em:
- 💅 **Unha** (Manicure, Pedicure, Alongamento)
- 🦋 **Sobrancelha** (Design, Micropigmentação, Henna)
- 🪶 **Depilação** (Cera, Laser)

**Inspiração:** Espaço Laser (imagens de referência fornecidas)

---

## 🏗️ Arquitetura Web-First

### Stack Tecnológica

```
Frontend Web:
├── React 18 (web)
├── TypeScript
├── TailwindCSS (styling)
├── React Router (navegação)
├── Redux Toolkit (state)
└── Lucide Icons

Backend:
├── Firebase Auth (autenticação)
├── Firestore (database)
├── Firebase Storage (imagens)
└── Cloud Functions (opcional)

Integrações:
├── Google Calendar API
├── Stripe (pagamentos)
└── Email notifications
```

### Estrutura de Pastas (Web-First)

```
apps/web/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── NextAppointment.tsx
│   │   │   ├── PromoBanner.tsx
│   │   │   └── ServiceGrid.tsx
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceDetail.tsx
│   │   │   └── ServiceFilter.tsx
│   │   ├── booking/
│   │   │   ├── Calendar.tsx
│   │   │   ├── TimeSlots.tsx
│   │   │   └── BookingSummary.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── ServiceDetailPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── MyAppointmentsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── cart/
│   │   ├── favorites/
│   │   └── profile/
│   ├── services/
│   │   ├── api/
│   │   ├── firebase/
│   │   └── calendar/
│   ├── hooks/
│   ├── utils/
│   └── App.tsx
├── public/
└── package.json
```

---

## 📱 Features Mapeadas das Imagens

### 🏠 Tela 1: Home / Menu Principal

**Elementos Observados:**
- Header: Logo + Busca + Carrinho
- Saudação personalizada ("Olá, NOME")
- Badge de pontos/créditos
- Seções: "Pacotes" e "Minha Conta"
- Lista navegável

**Features a Implementar:**
```
✅ Header com logo, busca e carrinho
✅ Sistema de pontos/fidelidade
✅ Perfil do usuário
✅ Menu de navegação
✅ Seções categorizadas (Pacotes, Conta)
✅ Lista de links com ícones de seta
```

---

### 🏠 Tela 2: Home Feed

**Elementos Observados:**
- Card de próximo agendamento (data + hora)
- Badge "Você tem X Pontos"
- Banner promocional grande (carousel)
- Dots indicator (múltiplos banners)
- Toggle Feminino/Masculino
- Grid de serviços com imagens

**Features a Implementar:**
```
✅ Card de próximo agendamento destacado
✅ Sistema de pontos visível
✅ Carousel de banners promocionais
  - Swipeable
  - Dots indicator
  - CTAs nos banners
✅ Filtro de gênero (Feminino/Masculino)
✅ Grid de serviços
  - Imagens grandes
  - Nome do serviço
  - Preview de preço
```

---

### 📋 Tela 3: Lista de Serviços

**Elementos Observados:**
- Cards grandes com imagem do serviço
- Título descritivo
- Preço original riscado
- Preço promocional destacado
- Parcelamento ("Por 6x R$ XX,XX")
- Botão "VER MAIS"
- Seção "Ganhe 3 sessões gratuitas"
- Call-to-action de indicação

**Features a Implementar:**
```
✅ Card de serviço
  - Imagem destacada (corpo/área do serviço)
  - Título + subtítulo
  - Preço de/por
  - Opções de parcelamento
  - Botão CTA
✅ Sistema de precificação
  - Preço normal (riscado)
  - Preço promocional
  - Desconto percentual
  - Parcelamento
✅ Programa de indicação
  - Banner informativo
  - Link de compartilhamento
  - Recompensas
```

---

### 📋 Tela 4: Grid de Serviços Detalhado

**Elementos Observados:**
- Toggle Feminino/Masculino mantido
- Grid 2 colunas
- Múltiplos serviços (Virilha, Ânus, Pernas, etc.)
- Preços e parcelamentos diferentes
- Imagens anatomicamente corretas

**Features a Implementar:**
```
✅ Layout responsivo de grid
  - 2 colunas desktop
  - 1 coluna mobile
✅ Cards uniformes
✅ Categorização por gênero
✅ Listagem de todos os serviços
✅ Preços dinâmicos
```

---

### 📅 Tela 5: Detalhes do Agendamento

**Elementos Observados:**
- Data grande (19/11) + horário (10:00)
- Badge de status "AGENDADO"
- Lista de serviços com ícones
- Progresso de sessões ("Sessão 7 de 10")
- Botão "Ver mais detalhes" (expansível)
- Ações: REAGENDAR e CANCELAR
- Banner informativo (preparação)
- Botão "HISTÓRICO"

**Features a Implementar:**
```
✅ Card de agendamento
  - Data e hora destacadas
  - Status visual
  - Badge colorido
✅ Lista de serviços agendados
  - Ícone visual de cada serviço
  - Nome do serviço
  - Progresso de pacote
✅ Sistema de pacotes
  - Tracking de sessões (X de Y)
  - Progresso visual
✅ Ações do agendamento
  - Reagendar (abre calendário)
  - Cancelar (confirmação)
  - Ver detalhes (expandir)
✅ Banner de preparação
  - Dicas pré-sessão
  - CTA informativo
✅ Histórico de agendamentos
  - Lista de agendamentos passados
  - Status completado
```

---

## 🎨 Design System

### Cores Principais

```css
/* Primary */
--blue-primary: #0047FF;
--blue-hover: #0039CC;

/* Secondary */
--orange-cta: #FF6B00;
--orange-hover: #E66000;

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-900: #111827;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Tipografia

```css
/* Headings */
h1: 36px, bold
h2: 30px, semibold
h3: 24px, semibold
h4: 20px, semibold

/* Body */
body: 16px, regular
small: 14px, regular
caption: 12px, regular

/* Preços */
price-large: 28px, bold
price-small: 20px, bold
price-original: 16px, regular, line-through
```

### Componentes Base

```
✅ Button
  - Primary (azul)
  - Secondary (branco + borda azul)
  - CTA (laranja)
  - Sizes: sm, md, lg

✅ Card
  - Com sombra
  - Hover effect
  - Bordas arredondadas

✅ Input
  - Com label
  - Estados: default, focus, error
  - Ícones opcionais

✅ Badge
  - Status (agendado, concluído, cancelado)
  - Pontos/créditos
  - Promoções

✅ Avatar
  - Circular
  - Com fallback de iniciais
  - Sizes: sm, md, lg
```

---

## 🚀 Plano de Implementação

### **FASE 1: Setup e Infraestrutura** (Sessão 1)

#### 1.1 Criar Aplicação Web Pura
```bash
# Criar app React com Vite
npm create vite@latest bellebook-web -- --template react-ts
cd bellebook-web
npm install

# Instalar dependências essenciais
npm install react-router-dom redux @reduxjs/toolkit
npm install firebase
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install date-fns
```

#### 1.2 Configurar TailwindCSS
- Setup completo
- Design system tokens
- Componentes base

#### 1.3 Configurar Firebase
- Autenticação
- Firestore
- Storage
- Regras de segurança

#### 1.4 Estrutura de Pastas
- Criar estrutura modular
- Setup de rotas
- Redux store base

**Entregável:** Aplicação web rodando com estrutura completa

---

### **FASE 2: Autenticação e Perfil** (Sessão 2)

#### 2.1 Sistema de Autenticação
```typescript
Features:
✅ Registro de usuário
  - Email + senha
  - Nome completo
  - Telefone
  - Validação de campos
  
✅ Login
  - Email + senha
  - Lembrar-me
  - Esqueci minha senha
  
✅ Recuperação de senha
  - Email de reset
  - Página de reset
  
✅ Logout
  - Limpar sessão
  - Redirect para home
```

#### 2.2 Perfil do Usuário
```typescript
Features:
✅ Visualizar perfil
  - Avatar
  - Nome
  - Email
  - Telefone
  - Endereço
  
✅ Editar perfil
  - Upload de avatar
  - Atualizar dados
  - Validação
  
✅ Sistema de pontos
  - Visualizar saldo
  - Histórico de pontos
  - Regras de acúmulo
```

**Entregável:** Autenticação completa + perfil funcional

---

### **FASE 3: Catálogo de Serviços** (Sessão 3)

#### 3.1 Listagem de Serviços
```typescript
Features:
✅ Grid de serviços
  - Imagens
  - Títulos
  - Preços
  - Filtros
  
✅ Filtros
  - Por categoria (Unha, Sobrancelha, Depilação)
  - Por gênero (Feminino, Masculino)
  - Por preço
  - Por disponibilidade
  
✅ Busca
  - Por nome
  - Por categoria
  - Autocomplete
```

#### 3.2 Detalhes do Serviço
```typescript
Features:
✅ Página de detalhes
  - Galeria de imagens
  - Descrição completa
  - Preço e parcelamento
  - Duração
  - Profissionais disponíveis
  
✅ Reviews
  - Avaliações
  - Comentários
  - Média de estrelas
  
✅ Ações
  - Adicionar ao carrinho
  - Favoritar
  - Compartilhar
```

#### 3.3 Sistema de Favoritos
```typescript
Features:
✅ Adicionar/remover favoritos
✅ Página de favoritos
✅ Sincronização com Firebase
✅ Ícone de coração animado
```

**Entregável:** Catálogo completo com busca, filtros e favoritos

---

### **FASE 4: Carrinho e Checkout** (Sessão 4)

#### 4.1 Carrinho de Compras
```typescript
Features:
✅ Adicionar serviço ao carrinho
✅ Remover do carrinho
✅ Atualizar quantidade (pacotes)
✅ Ver total
✅ Cupom de desconto
✅ Badge de quantidade no ícone
```

#### 4.2 Processo de Checkout
```typescript
Features:
✅ Resumo do pedido
✅ Escolha de data/hora
✅ Escolha de profissional
✅ Confirmar agendamento
✅ Método de pagamento
  - Pagar na loja
  - Pagar agora (Stripe)
```

#### 4.3 Integração com Stripe
```typescript
Features:
✅ Setup do Stripe
✅ Formulário de pagamento
✅ Processamento seguro
✅ Webhook para confirmação
✅ Desconto para pagamento antecipado (10%)
```

**Entregável:** Carrinho e checkout funcionais com pagamento

---

### **FASE 5: Sistema de Agendamentos** (Sessão 5)

#### 5.1 Agendar Serviço
```typescript
Features:
✅ Calendário interativo
  - Visualização mensal
  - Dias disponíveis destacados
  - Bloqueio de datas passadas
  
✅ Seleção de horário
  - Slots disponíveis
  - Duração do serviço
  - Intervalo entre agendamentos
  
✅ Escolha de profissional
  - Lista de profissionais
  - Disponibilidade
  - Avaliações
  
✅ Confirmação
  - Resumo do agendamento
  - Data, hora, serviço, profissional
  - Preço total
  - Botão confirmar
```

#### 5.2 Meus Agendamentos
```typescript
Features:
✅ Lista de agendamentos
  - Próximos (destaque)
  - Futuros
  - Passados (histórico)
  
✅ Card de agendamento
  - Data e hora
  - Status
  - Serviços incluídos
  - Progresso de pacote
  - Profissional
  
✅ Ações
  - Ver detalhes
  - Reagendar
  - Cancelar
  - Avaliar (após conclusão)
```

#### 5.3 Sistema de Pacotes
```typescript
Features:
✅ Criar pacote de sessões
  - Múltiplas sessões
  - Desconto no pacote
  - Validade
  
✅ Tracking de progresso
  - Sessão X de Y
  - Barra de progresso
  - Próxima sessão
  
✅ Agendar sessão do pacote
  - Selecionar data
  - Marcar sessão como realizada
```

**Entregável:** Sistema completo de agendamentos

---

### **FASE 6: Google Calendar Integration** (Sessão 6)

#### 6.1 OAuth com Google
```typescript
Features:
✅ Login com Google
✅ Autorização de calendário
✅ Refresh token automático
✅ Desconectar conta
```

#### 6.2 Sincronização de Calendário
```typescript
Features:
✅ Criar evento no Google Calendar
  - Ao confirmar agendamento
  - Título do serviço
  - Data e hora
  - Localização
  - Descrição
  
✅ Atualizar evento
  - Ao reagendar
  - Sincronização bidirecional
  
✅ Deletar evento
  - Ao cancelar agendamento
  
✅ Lembretes
  - Email 24h antes
  - Email 1h antes
  - Notificação push (futuro)
```

**Entregável:** Integração completa com Google Calendar

---

### **FASE 7: Promoções e Banners** (Sessão 7)

#### 7.1 Sistema de Banners
```typescript
Features:
✅ CRUD de banners (admin)
✅ Upload de imagens
✅ Link de destino
✅ Ordem de exibição
✅ Data de validade

✅ Carousel na home
  - Autoplay
  - Swipe manual
  - Dots indicator
  - Navegação por setas
```

#### 7.2 Sistema de Promoções
```typescript
Features:
✅ Criar promoção
  - Tipo: percentual, valor fixo
  - Produtos aplicáveis
  - Validade
  - Limite de uso
  
✅ Cupom de desconto
  - Código único
  - Validação no carrinho
  - Aplicar desconto
  
✅ Badge de promoção
  - "X% OFF"
  - Destaque visual nos cards
```

#### 7.3 Programa de Indicação
```typescript
Features:
✅ Link único de indicação
✅ Compartilhar link
✅ Tracking de indicações
✅ Recompensas
  - Pontos para quem indica
  - Desconto para novo cliente
✅ Página de indicações
```

**Entregável:** Sistema completo de marketing e promoções

---

### **FASE 8: Dashboard Admin** (Sessão 8)

#### 8.1 Painel Administrativo
```typescript
Features:
✅ Login admin
✅ Dashboard overview
  - Total de agendamentos
  - Receita do dia/mês
  - Novos clientes
  - Serviços mais vendidos
  
✅ Gestão de serviços
  - CRUD completo
  - Upload de imagens
  - Preços e pacotes
  
✅ Gestão de agendamentos
  - Visualizar todos
  - Confirmar/cancelar
  - Reagendar
  
✅ Gestão de clientes
  - Lista de clientes
  - Histórico de cada cliente
  - Pontos/créditos
  
✅ Gestão de profissionais
  - Adicionar/editar/remover
  - Disponibilidade
  - Serviços que realiza
  
✅ Relatórios
  - Vendas
  - Agendamentos
  - Cancelamentos
  - Exportar dados
```

**Entregável:** Dashboard admin completo

---

### **FASE 9: Otimizações e SEO** (Sessão 9)

#### 9.1 Performance
```typescript
✅ Code splitting
✅ Lazy loading de imagens
✅ Caching de dados
✅ Service Worker
✅ PWA setup
```

#### 9.2 SEO
```typescript
✅ Meta tags
✅ Open Graph
✅ Sitemap
✅ Robots.txt
✅ Schema markup (JSON-LD)
```

#### 9.3 Analytics
```typescript
✅ Google Analytics
✅ Tracking de eventos
✅ Funis de conversão
✅ Heatmaps
```

**Entregável:** App otimizado e rastreável

---

### **FASE 10: Adaptação Mobile** (Sessão 10)

#### 10.1 Responsividade Final
```typescript
✅ Revisar todos os componentes
✅ Touch gestures
✅ Mobile navigation
✅ Otimizar para telas pequenas
```

#### 10.2 PWA para Mobile
```typescript
✅ Instalável
✅ Funciona offline
✅ Push notifications
✅ Add to home screen
```

#### 10.3 React Native (Opcional)
```typescript
✅ Avaliar necessidade
✅ Reutilizar lógica de negócio
✅ Criar UI nativa se necessário
```

**Entregável:** Experiência mobile completa

---

## 📊 Resumo de Entregas por Fase

| Fase | Sessão | Entregável | Tempo Estimado |
|------|--------|------------|----------------|
| 1 | Setup | App web + estrutura | 2-3h |
| 2 | Auth | Login/Register/Perfil | 3-4h |
| 3 | Catálogo | Serviços + Favoritos | 3-4h |
| 4 | E-commerce | Carrinho + Checkout | 4-5h |
| 5 | Booking | Agendamentos + Pacotes | 4-5h |
| 6 | Calendar | Google Calendar sync | 3-4h |
| 7 | Marketing | Promoções + Banners | 3-4h |
| 8 | Admin | Dashboard completo | 4-5h |
| 9 | Otimização | Performance + SEO | 2-3h |
| 10 | Mobile | Adaptação final | 3-4h |

**Total:** ~30-40 horas de desenvolvimento

---

## 🎯 Próximas Ações Imediatas

### Para a Próxima Sessão com Claude:

```markdown
# SESSÃO 1: Setup Web-First

## Objetivo
Criar aplicação web React com estrutura completa

## Tarefas
1. [ ] Criar novo projeto React com Vite
2. [ ] Instalar e configurar TailwindCSS
3. [ ] Setup do design system (cores, tipografia)
4. [ ] Configurar React Router
5. [ ] Setup Redux Toolkit
6. [ ] Configurar Firebase (já feito, mover para web)
7. [ ] Criar estrutura de pastas
8. [ ] Criar componentes base (Button, Card, Input)
9. [ ] Criar layout principal (Header, Footer, Navigation)
10. [ ] Página Home básica

## Comando para iniciar
```bash
cd d:\BelleBook\BelleBook
npm create vite@latest apps/web -- --template react-ts
```

## Arquivos a criar
- apps/web/src/App.tsx
- apps/web/src/components/layout/*
- apps/web/src/components/common/*
- apps/web/tailwind.config.js
- apps/web/src/styles/globals.css

## Resultado esperado
✅ Aplicação rodando em http://localhost:5173
✅ Design system aplicado
✅ Navegação funcionando
✅ Componentes base prontos
```

---

## 💡 Princípios do Desenvolvimento

1. **Web-First Always**
   - Desenvolver pensando em navegador primeiro
   - Testar no Chrome DevTools
   - Mobile é adaptação, não prioridade inicial

2. **Componentes Reutilizáveis**
   - Criar uma vez, usar em todo lugar
   - Props bem definidas
   - TypeScript strict

3. **Design System Consistente**
   - Seguir as cores e tipografia definidas
   - Usar TailwindCSS para styling
   - Componentes devem parecer família

4. **Performance em Mente**
   - Code splitting desde o início
   - Lazy loading de imagens
   - Evitar re-renders desnecessários

5. **Firebase como Backend**
   - Firestore para dados
   - Storage para imagens
   - Cloud Functions para lógica complexa

---

## 📝 Template para Próximas Sessões

```markdown
# SESSÃO X: [Nome da Fase]

## Contexto
- Fase atual do projeto
- O que já foi feito
- O que falta fazer

## Objetivos desta sessão
1. Objetivo 1
2. Objetivo 2
3. Objetivo 3

## Checklist de tarefas
- [ ] Tarefa 1
- [ ] Tarefa 2
- [ ] Tarefa 3

## Arquivos a criar/modificar
- arquivo1.tsx
- arquivo2.tsx

## Resultado esperado
✅ Feature X funcionando
✅ Testes passando
✅ Documentação atualizada

## Próximos passos
- Próxima feature
- Possíveis problemas
- Dependências
```

---

## 🚀 Como Usar Este Roadmap

### Para Você (Developer)
1. Leia a fase atual completamente
2. Entenda o objetivo antes de começar
3. Siga a ordem das tarefas
4. Teste cada feature antes de prosseguir
5. Documente decisões importantes

### Para o Claude (Próximas Sessões)
1. **Sempre comece lendo este arquivo**
2. Identifique a fase atual
3. Foque apenas nos objetivos da fase
4. Não pule etapas
5. Documente o progresso ao final

### Comandos Úteis
```bash
# Iniciar dev server
cd apps/web
npm run dev

# Rodar testes
npm run test

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## 📞 Suporte

**Dúvidas durante implementação?**
- Consulte FIREBASE_SETUP.md para Firebase
- Consulte ERROR_HANDLING_GUIDE.md para erros
- Consulte este arquivo para roadmap

**Próxima sessão com Claude:**
- Traga este arquivo
- Mencione a fase atual
- Liste o que já foi feito

---

**Versão:** 1.0  
**Última atualização:** Novembro 2025  
**Status:** ✅ Pronto para iniciar Fase 1
