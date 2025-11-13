# 🚀 BelleBook V2 - Quick Start

## Stack Escolhida

- **Backend:** NestJS + PostgreSQL + Prisma
- **Frontend:** Next.js + TailwindCSS + Shadcn/UI
- **Integrações:** Google Calendar + WhatsApp + Stripe
- **Deploy:** Vercel + Railway/Supabase

---

## Comandos para Começar AGORA (Copie e Cole)

### 1️⃣ Criar Backend (NestJS)

```bash
# Terminal 1
cd d:\BelleBook\BelleBook
nest new bellebook-backend --package-manager npm
cd bellebook-backend

# Instalar tudo de uma vez
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt @prisma/client prisma bcrypt class-validator class-transformer stripe @types/bcrypt @types/passport-jwt -D
```

### 2️⃣ Criar Frontend (Next.js)

```bash
# Terminal 2
cd d:\BelleBook\BelleBook
npx create-next-app@latest bellebook-web --typescript --tailwind --app --use-npm

# Responder:
# ✔ Would you like to use ESLint? → Yes
# ✔ Would you like to use `src/` directory? → No
# ✔ Would you like to customize the default import alias? → No

cd bellebook-web

# Instalar Shadcn/UI e dependências
npx shadcn-ui@latest init
# Escolher: Default style, Rose color, CSS variables

npm install @hookform/resolvers react-hook-form zod @tanstack/react-query zustand lucide-react date-fns @stripe/stripe-js
```

### 3️⃣ Setup Database (PostgreSQL)

```bash
# Opção A: Docker Local
docker run --name bellebook-db -e POSTGRES_USER=bellebook -e POSTGRES_PASSWORD=bellebook123 -e POSTGRES_DB=bellebook -p 5432:5432 -d postgres:15

# Opção B: Usar Supabase (RECOMENDADO - Grátis!)
# 1. Ir em https://supabase.com
# 2. Criar projeto
# 3. Pegar connection string
```

### 4️⃣ Configurar Prisma

```bash
cd bellebook-backend
npx prisma init
```

Editar `.env`:
```env
DATABASE_URL="postgresql://bellebook:bellebook123@localhost:5432/bellebook"
JWT_SECRET="bellebook-secret-key-2024"
```

### 5️⃣ Rodar Tudo

```bash
# Terminal 1 - Backend
cd bellebook-backend
npm run start:dev
# API em http://localhost:3001

# Terminal 2 - Frontend
cd bellebook-web
npm run dev
# App em http://localhost:3000

# Terminal 3 - Database
docker start bellebook-db
```

---

## Arquivos para Criar Primeiro

### Backend: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  createdAt DateTime @default(now())
}
```

### Frontend: `app/page.tsx` (Landing)

```tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-50">
      <h1 className="text-6xl font-bold text-rose-600 text-center pt-20">
        BelleBook
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Agende seus serviços de beleza
      </p>
    </div>
  )
}
```

---

## Paleta de Cores (TailwindCSS)

```css
Rosa: rose-500 (#FF6B9D)
Rosa Claro: rose-100 (#FFC8DD)
Gradiente: from-rose-500 to-pink-500
Fundo: from-rose-50 to-pink-50
```

---

## Próximos Passos

1. ✅ Setup completo
2. ⏳ Criar autenticação
3. ⏳ Tela de categorias
4. ⏳ Lista de serviços
5. ⏳ Carrinho
6. ⏳ Pagamento Stripe
7. ⏳ Agendamento
8. ⏳ Google Calendar
9. ⏳ WhatsApp API
10. ⏳ Notificações

---

## Links Úteis

- **NestJS:** https://nestjs.com
- **Next.js:** https://nextjs.org
- **Prisma:** https://prisma.io
- **Shadcn/UI:** https://ui.shadcn.com
- **Supabase:** https://supabase.com
- **Vercel:** https://vercel.com

---

**🎯 Resultado Esperado:**
- Backend API rodando em `http://localhost:3001`
- Frontend Web rodando em `http://localhost:3000`
- PostgreSQL conectado
- Pronto para desenvolver!
