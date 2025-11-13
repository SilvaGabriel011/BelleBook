# 🚀 BelleBook - Guia de Implementação Imediata

## Passo 1: Setup Backend (NestJS + PostgreSQL)

### 1.1 Criar o Backend

```bash
cd d:\BelleBook\BelleBook
nest new bellebook-backend --package-manager npm
cd bellebook-backend
```

### 1.2 Instalar Dependências

```bash
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @prisma/client prisma
npm install bcrypt class-validator class-transformer
npm install stripe
npm install @types/bcrypt @types/passport-jwt -D
```

### 1.3 Configurar Prisma

```bash
npx prisma init
```

Editar `prisma/schema.prisma` com o schema fornecido no roadmap.

### 1.4 Criar .env

```env
DATABASE_URL="postgresql://bellebook:bellebook123@localhost:5432/bellebook"
JWT_SECRET="bellebook-secret-2024"
STRIPE_SECRET_KEY="sk_test_..."
```

### 1.5 Rodar Database

```bash
# Opção 1: Docker Local
docker run --name bellebook-db -e POSTGRES_USER=bellebook -e POSTGRES_PASSWORD=bellebook123 -e POSTGRES_DB=bellebook -p 5432:5432 -d postgres:15

# Opção 2: Usar Supabase (grátis)
# Criar conta em supabase.com e pegar a connection string
```

### 1.6 Rodar Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## Passo 2: Setup Frontend (Next.js + TailwindCSS)

### 2.1 Criar o Frontend

```bash
cd d:\BelleBook\BelleBook
npx create-next-app@latest bellebook-web --typescript --tailwind --app
cd bellebook-web
```

### 2.2 Instalar Shadcn/UI

```bash
npx shadcn-ui@latest init

# Quando perguntar, escolha:
# - Style: Default
# - Base color: Rose
# - CSS variables: Yes
```

### 2.3 Instalar Dependências

```bash
npm install @hookform/resolvers react-hook-form zod
npm install @tanstack/react-query zustand
npm install lucide-react date-fns
npm install @stripe/stripe-js
```

### 2.4 Configurar Tailwind com Paleta Feminina

Editar `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#FFF5F5',
          100: '#FFC8DD',
          200: '#FFB5D5',
          300: '#FFA3CD',
          400: '#FF90C5',
          500: '#FF6B9D',
          600: '#FF4585',
          700: '#E91E63',
          800: '#C9184A',
          900: '#A61442',
        },
        peach: '#FFB5A7',
        lavender: '#E4C1F9',
        mint: '#A8DADC',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

### 2.5 Adicionar Fontes

Em `app/layout.tsx`:

```typescript
import { Poppins, Playfair_Display } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
})
```

---

## Passo 3: Criar Primeira Feature - Autenticação

### 3.1 Backend - Módulo de Auth

```bash
cd bellebook-backend
nest g module auth
nest g controller auth
nest g service auth
nest g module users
nest g service users
```

### 3.2 Auth Service

Criar `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
```

### 3.3 Frontend - Página de Login

Criar `bellebook-web/app/(auth)/login/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (res.ok) {
        const { access_token } = await res.json()
        localStorage.setItem('token', access_token)
        router.push('/home')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 font-heading text-rose-700">
          BelleBook
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Entre na sua conta
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem conta?{' '}
            <Link href="/register" className="text-rose-600 font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Passo 4: Criar Tela de Categorias

Criar `bellebook-web/app/(dashboard)/home/page.tsx`:

```tsx
'use client'

import { Heart, ShoppingCart, Bell } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 1, name: 'Unha', icon: '💅', color: 'from-pink-400 to-rose-500', href: '/services/unha' },
  { id: 2, name: 'Sobrancelha', icon: '🦋', color: 'from-purple-400 to-pink-500', href: '/services/sobrancelha' },
  { id: 3, name: 'Cabelo', icon: '💇‍♀️', color: 'from-amber-400 to-orange-500', href: '/services/cabelo' },
  { id: 4, name: 'Depilação', icon: '🪶', color: 'from-teal-400 to-cyan-500', href: '/services/depilacao' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-rose-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600 font-heading">BelleBook</h1>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-rose-50 rounded-lg">
              <Heart className="w-6 h-6 text-gray-600" />
            </button>
            <button className="relative p-2 hover:bg-rose-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button className="relative p-2 hover:bg-rose-50 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Points Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 text-center">
        <p className="text-lg font-semibold">✨ Você tem 150 pontos!</p>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 font-heading">
          O que você deseja hoje?
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 h-48 flex flex-col items-center justify-center`}>
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <h3 className="text-white text-2xl font-bold">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 🚀 Comandos para Rodar AGORA

### Terminal 1 - Backend

```bash
cd d:\BelleBook\BelleBook\bellebook-backend
npm run start:dev
# API rodando em http://localhost:3001
```

### Terminal 2 - Frontend

```bash
cd d:\BelleBook\BelleBook\bellebook-web
npm run dev
# App rodando em http://localhost:3000
```

### Terminal 3 - Database (se usando Docker)

```bash
docker start bellebook-db
```

---

## ✅ Checklist de Hoje

- [ ] Setup NestJS backend
- [ ] Setup Next.js frontend
- [ ] Configurar PostgreSQL
- [ ] Criar schema Prisma
- [ ] Implementar autenticação
- [ ] Criar página de login
- [ ] Criar página de categorias
- [ ] Testar fluxo completo

---

## 📋 Próximas Sessões

### Sessão 2
- Listar serviços por categoria
- Adicionar ao carrinho
- Sistema de favoritos

### Sessão 3
- Checkout com Stripe
- Agendamento de data/hora
- Integração Google Calendar

### Sessão 4
- WhatsApp Business API
- Sistema de notificações
- Avaliações

---

**Pronto para começar! 🚀**

Execute os comandos acima e você terá:
- ✅ Backend NestJS rodando
- ✅ Frontend Next.js com TailwindCSS
- ✅ PostgreSQL configurado
- ✅ Autenticação funcionando
- ✅ Tela de categorias pronta

O app estará rodando em **http://localhost:3000**
