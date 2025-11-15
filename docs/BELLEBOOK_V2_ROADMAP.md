# 🌸 BelleBook V2 - Roadmap Web-First com NestJS

## 🎯 Visão do Produto

**BelleBook** - Plataforma de agendamento de serviços de beleza voltada para o público feminino.

### Serviços Oferecidos
- 💅 **Unha** - Manicure, pedicure, alongamento, nail art
- 🦋 **Sobrancelha** - Design, micropigmentação, henna
- 💇‍♀️ **Cabelo** - Corte, coloração, tratamentos, penteados
- 🪶 **Depilação** - Cera, laser, linha

### Público-Alvo
- **Mulheres 18-45 anos**
- Valorizam praticidade e estética
- Buscam qualidade e confiança
- Apreciam experiências personalizadas

---

## 🎨 Design System - Paleta Feminina

### Cores Principais

```css
/* Cores Principais - Tons Femininos */
--rose-primary: #FF6B9D;      /* Rosa vibrante principal */
--rose-light: #FFC8DD;        /* Rosa claro para backgrounds */
--rose-dark: #C9184A;         /* Rosa escuro para textos */

/* Cores Secundárias */
--peach: #FFB5A7;             /* Pêssego suave */
--lavender: #E4C1F9;          /* Lavanda delicada */
--mint: #A8DADC;              /* Verde menta suave */

/* Neutros Suaves */
--cream: #FFF5F5;             /* Creme para fundos */
--soft-gray: #F7F3F4;         /* Cinza suavíssimo */
--charcoal: #4A4A4A;          /* Cinza escuro para textos */
--white: #FFFFFF;

/* Status & Feedback */
--success: #95D5B2;           /* Verde menta */
--warning: #FFCB77;           /* Amarelo dourado */
--error: #FF8FA3;             /* Rosa coral */
--info: #B8B8FF;              /* Lilás */

/* Gradientes */
--gradient-primary: linear-gradient(135deg, #FF6B9D 0%, #FFC8DD 100%);
--gradient-sunset: linear-gradient(135deg, #FFB5A7 0%, #FF6B9D 100%);
```

### Tipografia

```css
/* Fonte Principal */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Fonte Secundária (elegante) */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

/* Aplicação */
--font-heading: 'Playfair Display', serif;  /* Títulos elegantes */
--font-body: 'Poppins', sans-serif;         /* Corpo do texto */
```

---

## 🏗️ Arquitetura Técnica

### Stack Completa

```yaml
Backend:
  - NestJS (Node.js Framework)
  - PostgreSQL (Database)
  - Prisma ORM
  - JWT Authentication
  - Bull (Queue para notificações)
  - Nodemailer (E-mails)

Frontend:
  - Next.js 14 (React Framework)
  - TailwindCSS (Styling)
  - Shadcn/ui (Components)
  - React Hook Form
  - Zustand (State Management)
  - React Query (Data Fetching)
  - Framer Motion (Animações)

Integrações:
  - Stripe (Pagamentos)
  - Google Calendar API
  - WhatsApp Business API
  - SendGrid (E-mails transacionais)
  - Cloudinary (Upload de imagens)

Deploy:
  - Vercel (Frontend)
  - Railway/Render (Backend)
  - Supabase (PostgreSQL hosted)
```

---

## 📱 Fluxo Principal do Usuário

### Jornada Completa

1. **Landing Page** → Usuária conhece a plataforma
2. **Cadastro/Login** → Cria conta ou faz login
3. **Home** → Vê categorias (Unha, Sobrancelha, Cabelo, Depilação)
4. **Seleção de Serviço** → Escolhe o serviço desejado
5. **Adicionar ao Carrinho** → Adiciona um ou mais serviços
6. **Checkout** → Realiza pagamento via Stripe
7. **Agendamento** → Escolhe data e horário
8. **Confirmação** → Recebe confirmação por WhatsApp e e-mail
9. **Sincronização** → Evento criado no Google Calendar
10. **Lembrete** → 2 dias antes recebe notificação
11. **Avaliação** → 2 dias depois é solicitada avaliação

---

## 🚀 Plano de Implementação - FASE 0

### Setup Completo do Projeto

#### Backend (NestJS + PostgreSQL)

```bash
# 1. Criar projeto NestJS
cd d:\BelleBook\BelleBook
nest new bellebook-backend --package-manager npm
cd bellebook-backend

# 2. Instalar dependências essenciais
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @prisma/client prisma
npm install bcrypt class-validator class-transformer
npm install @nestjs/bull bull
npm install stripe
npm install @types/bcrypt -D

# 3. Configurar Prisma
npx prisma init

# 4. Criar estrutura de pastas
mkdir -p src/auth src/users src/services src/bookings src/payments
mkdir -p src/notifications src/integrations src/common
```

#### Frontend (Next.js + TailwindCSS)

```bash
# 1. Criar projeto Next.js
cd d:\BelleBook\BelleBook
npx create-next-app@latest bellebook-web --typescript --tailwind --app --use-npm
cd bellebook-web

# 2. Instalar Shadcn/UI
npx shadcn-ui@latest init

# 3. Instalar dependências
npm install @hookform/resolvers react-hook-form zod
npm install @tanstack/react-query zustand
npm install framer-motion lucide-react
npm install date-fns react-hot-toast
npm install @stripe/stripe-js

# 4. Criar estrutura
mkdir -p app/(auth) app/(dashboard) app/(public)
mkdir -p components/ui components/forms components/layout
mkdir -p lib/api lib/hooks lib/store
```

#### PostgreSQL com Docker

```bash
# Criar container PostgreSQL
docker run --name bellebook-db \
  -e POSTGRES_USER=bellebook \
  -e POSTGRES_PASSWORD=bellebook123 \
  -e POSTGRES_DB=bellebook \
  -p 5432:5432 \
  -d postgres:15-alpine

# Verificar se está rodando
docker ps
```

---

## 📊 Database Schema (Prisma)

Criar arquivo `bellebook-backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  phone         String?
  avatar        String?
  birthDate     DateTime?
  googleId      String?
  points        Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  bookings      Booking[]
  reviews       Review[]
  favorites     Service[] @relation("UserFavorites")
  cart          CartItem[]
  notifications Notification[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  description String?
  icon        String?
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  
  services    Service[]
}

model Service {
  id            String    @id @default(cuid())
  categoryId    String
  name          String
  description   String
  duration      Int
  price         Decimal
  promoPrice    Decimal?
  images        String[]
  isActive      Boolean   @default(true)
  
  category      Category  @relation(fields: [categoryId], references: [id])
  bookings      Booking[]
  reviews       Review[]
  favoritedBy   User[]    @relation("UserFavorites")
  cartItems     CartItem[]
}

model Booking {
  id              String    @id @default(cuid())
  userId          String
  serviceId       String
  date            DateTime
  status          String    @default("PENDING")
  paymentStatus   String    @default("PENDING")
  paymentId       String?
  totalPaid       Decimal?
  notes           String?
  googleEventId   String?
  createdAt       DateTime  @default(now())
  
  user            User      @relation(fields: [userId], references: [id])
  service         Service   @relation(fields: [serviceId], references: [id])
  review          Review?
  reminders       Reminder[]
}

model CartItem {
  id        String    @id @default(cuid())
  userId    String
  serviceId String
  quantity  Int       @default(1)
  addedAt   DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id])
  service   Service   @relation(fields: [serviceId], references: [id])
}

model Review {
  id        String    @id @default(cuid())
  userId    String
  serviceId String
  bookingId String    @unique
  rating    Int
  comment   String?
  images    String[]
  createdAt DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id])
  service   Service   @relation(fields: [serviceId], references: [id])
  booking   Booking   @relation(fields: [bookingId], references: [id])
}

model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String
  title     String
  message   String
  isRead    Boolean   @default(false)
  createdAt DateTime  @default(now())
  
  user      User      @relation(fields: [userId], references: [id])
}

model Reminder {
  id        String    @id @default(cuid())
  bookingId String
  type      String    // EMAIL, WHATSAPP, PUSH
  sentAt    DateTime?
  
  booking   Booking   @relation(fields: [bookingId], references: [id])
}
```

---

## 🎯 Tarefas Imediatas - PRÓXIMOS PASSOS

### 1. Backend API Endpoints

```typescript
// Autenticação
POST   /auth/register
POST   /auth/login
POST   /auth/google
POST   /auth/refresh
POST   /auth/forgot-password

// Usuários
GET    /users/profile
PUT    /users/profile
GET    /users/points
POST   /users/avatar

// Serviços
GET    /services/categories
GET    /services/category/:id
GET    /services/:id
GET    /services/search
POST   /services/favorite/:id
DELETE /services/favorite/:id

// Carrinho
GET    /cart
POST   /cart/add
PUT    /cart/update/:id
DELETE /cart/remove/:id
POST   /cart/clear

// Agendamentos
POST   /bookings/create
GET    /bookings/my-bookings
GET    /bookings/:id
PUT    /bookings/:id/cancel
PUT    /bookings/:id/reschedule
GET    /bookings/available-slots

// Pagamentos
POST   /payments/checkout
POST   /payments/webhook
GET    /payments/:id

// Avaliações
POST   /reviews/create
GET    /reviews/service/:id
GET    /reviews/my-reviews

// Notificações
GET    /notifications
PUT    /notifications/:id/read
POST   /notifications/subscribe

// Integrações
POST   /integrations/google-calendar/auth
POST   /integrations/google-calendar/sync
POST   /integrations/whatsapp/send
```

### 2. Frontend - Páginas Principais

```typescript
// Estrutura de Rotas (Next.js App Router)

app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
├── (public)/
│   ├── page.tsx              // Landing page
│   └── about/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx            // Layout com sidebar
│   ├── home/
│   │   └── page.tsx         // Home logada
│   ├── services/
│   │   ├── page.tsx         // Categorias
│   │   ├── [category]/
│   │   │   └── page.tsx     // Serviços da categoria
│   │   └── [id]/
│   │       └── page.tsx     // Detalhe do serviço
│   ├── cart/
│   │   └── page.tsx         // Carrinho
│   ├── checkout/
│   │   └── page.tsx         // Pagamento
│   ├── booking/
│   │   └── page.tsx         // Agendar
│   ├── bookings/
│   │   ├── page.tsx         // Meus agendamentos
│   │   └── [id]/
│   │       └── page.tsx     // Detalhe do agendamento
│   ├── profile/
│   │   └── page.tsx         // Perfil
│   └── notifications/
│       └── page.tsx         // Notificações
└── api/
    └── [...] // API routes se necessário
```

---

## 🔗 Configuração de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://bellebook:bellebook123@localhost:5432/bellebook?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URL="http://localhost:3001/auth/google/callback"

# Google Calendar
GOOGLE_CALENDAR_CLIENT_ID="..."
GOOGLE_CALENDAR_CLIENT_SECRET="..."

# WhatsApp
WHATSAPP_API_URL="https://api.whatsapp.com/..."
WHATSAPP_TOKEN="..."

# SendGrid
SENDGRID_API_KEY="..."
SENDGRID_FROM_EMAIL="noreply@bellebook.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="..."

# Analytics
NEXT_PUBLIC_GA_ID="G-..."
```

---

## 📋 Checklist para Começar

- [ ] Configurar PostgreSQL local ou usar Supabase
- [ ] Criar projeto NestJS
- [ ] Criar projeto Next.js
- [ ] Configurar Prisma e rodar migrations
- [ ] Criar módulo de autenticação
- [ ] Implementar registro e login
- [ ] Criar layout base com Tailwind
- [ ] Implementar página de categorias
- [ ] Adicionar sistema de carrinho
- [ ] Integrar Stripe para pagamentos
- [ ] Implementar agendamento
- [ ] Configurar Google Calendar
- [ ] Configurar WhatsApp Business API
- [ ] Implementar notificações
- [ ] Adicionar sistema de avaliações
- [ ] Deploy no Vercel

---

**Versão:** 2.0
**Stack:** NestJS + PostgreSQL + Next.js + TailwindCSS
**Deploy:** Vercel + Railway/Supabase
