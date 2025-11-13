# 🚀 Como Rodar o BelleBook

Este guia explica como iniciar o frontend e backend do BelleBook.

## ⚠️ Problema Comum: Porta em Conflito

O **backend (NestJS)** e o **frontend (Next.js)** foram configurados para rodar em portas diferentes para evitar conflitos:

- 🔵 **Frontend (Next.js)**: `http://localhost:3000`
- 🟢 **Backend (NestJS)**: `http://localhost:3001`

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🟢 1. Iniciar o Backend (Obrigatório)

O backend **DEVE** estar rodando para que o login funcione!

### Passo 1: Navegar para a pasta do backend

```bash
cd bellebook-backend
```

### Passo 2: Instalar dependências (primeira vez)

```bash
npm install
```

### Passo 3: Rodar migrations do Prisma (primeira vez ou após mudanças no schema)

```bash
npx prisma generate
npx prisma migrate deploy
```

### Passo 4: Popular o banco com dados demo (opcional mas recomendado)

```bash
npm run seed
```

### Passo 5: Iniciar o servidor backend

```bash
npm run start:dev
```

**Você deve ver:**
```
🚀 Backend rodando em http://localhost:3001/api
```

✅ **Backend pronto!** Mantenha este terminal aberto.

---

## 🔵 2. Iniciar o Frontend

### Abra um NOVO terminal

### Passo 1: Navegar para a pasta do frontend

```bash
cd bellebook-web
```

### Passo 2: Instalar dependências (primeira vez)

```bash
npm install
```

### Passo 3: Criar arquivo de configuração (primeira vez)

O arquivo `.env.local` já deve existir com:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Passo 4: Iniciar o servidor frontend

```bash
npm run dev
```

**Você deve ver:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ **Frontend pronto!** Acesse: `http://localhost:3000`

---

## 🎭 Contas Demo para Login

Use estas contas na tela de login:

| Tipo | Email | Senha |
|------|-------|-------|
| 👑 Admin | `admin@bellebook.com` | `senha123` |
| 👤 Cliente | `cliente@bellebook.com` | `senha123` |
| 💼 Funcionária | `funcionaria@bellebook.com` | `senha123` |
| ⭐ VIP | `vip@bellebook.com` | `senha123` |

Ou clique nos botões de "Contas Demo para Testes" na tela de login!

---

## 🔍 Verificando se está funcionando

### Backend funcionando ✅

No terminal do backend, você deve ver:
```
🚀 Backend rodando em http://localhost:3001/api
```

Teste no navegador: http://localhost:3001/api
- Deve retornar: `{"message":"BelleBook API is running"}`

### Frontend funcionando ✅

No terminal do frontend, você deve ver:
```
✓ Ready in 2.5s
```

Abra o navegador em: http://localhost:3000
- Deve mostrar a tela de login

### Logs no Console do Navegador (F12) 📊

Com o error handler implementado, você verá logs detalhados:

#### ✅ Sucesso:
```
🔧 API Configuration: { baseURL: 'http://localhost:3001/api', ... }
📤 API Request: POST /auth/login
✅ Login bem-sucedido: { id: '...', email: 'cliente@bellebook.com', ... }
📥 API Response: POST /auth/login - 200
```

#### ❌ Erro de conexão (backend não rodando):
```
🚨 API Error Details
Request Error (No Response): Servidor não respondeu
❌ Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3001
```

#### ❌ Erro de credenciais:
```
🚨 API Error Details
Server Response Error: { status: 401, data: { message: 'Credenciais inválidas' } }
```

---

## ❌ Problemas Comuns

### 1. Erro "Não foi possível conectar ao servidor"

**Causa:** Backend não está rodando

**Solução:**
```bash
# Abra um terminal e rode o backend
cd bellebook-backend
npm run start:dev
```

### 2. Erro "Port 3001 is already in use"

**Causa:** Já existe um processo usando a porta 3001

**Solução Windows (PowerShell):**
```powershell
# Encontrar o processo
netstat -ano | findstr :3001

# Matar o processo (substitua <PID> pelo número da coluna final)
taskkill /PID <PID> /F
```

**Solução Linux/Mac:**
```bash
# Encontrar e matar o processo
lsof -ti:3001 | xargs kill -9
```

### 3. Erro "Port 3000 is already in use"

**Causa:** Já existe um processo usando a porta 3000 (porta do Next.js)

**Solução:** Mesma do item 2, mas use porta 3000

### 4. Dados demo não aparecem

**Solução:**
```bash
cd bellebook-backend
npm run seed
```

### 5. Erro de autenticação após login

**Causa:** Token JWT pode estar configurado incorretamente

**Solução:** Verifique se o `JWT_SECRET` está definido no `.env` do backend

---

## 🏗️ Estrutura do Projeto

```
BelleBook/
├── bellebook-backend/     # Backend NestJS (porta 3001)
│   ├── prisma/
│   │   ├── schema.prisma  # Schema do banco de dados
│   │   └── seed.ts        # Dados demo
│   ├── src/
│   │   ├── auth/          # Módulo de autenticação
│   │   ├── users/         # Módulo de usuários
│   │   ├── bookings/      # Módulo de agendamentos
│   │   └── services/      # Módulo de serviços
│   └── .env               # Configuração (PORT=3001)
│
└── bellebook-web/         # Frontend Next.js (porta 3000)
    ├── app/
    │   ├── (auth)/        # Páginas de autenticação
    │   │   └── login/     # Tela de login
    │   └── (dashboard)/   # Páginas principais
    ├── components/        # Componentes React
    ├── lib/
    │   ├── api.ts         # Cliente HTTP com interceptors
    │   └── errorHandler.ts # Error handler com logs
    └── .env.local         # Configuração (API_URL)
```

---

## 📊 Telas Implementadas

### ✅ Autenticação
- **Login** (`/login`) - Tela com contas demo
- **Registro** (`/register`) - Cadastro de novos usuários

### ✅ Dashboard (após login)
- **Home** (`/home`) - Página inicial (em desenvolvimento)
- **Serviços** (`/services`) - Catálogo de serviços
- **Agendamentos** (`/bookings`) - Gerenciar agendamentos
- **Perfil** (`/profile`) - Dados do usuário
- **Admin** (`/admin`) - Painel administrativo (só Admin)

### 🚧 Em Desenvolvimento
- Sistema de carrinho
- Integração com Stripe (pagamentos)
- Integração com Google Calendar
- Notificações (WhatsApp + Email)
- Sistema de pontos/fidelidade

---

## 🔌 APIs e Integrações

### ✅ Implementado
- **Autenticação JWT**
  - POST `/api/auth/login`
  - POST `/api/auth/register`
- **Usuários**
  - GET `/api/users/me` (usuário autenticado)
- **Error Handler**
  - Logs detalhados no console
  - Tratamento de erros de rede
  - Tratamento de erros de autenticação

### 🚧 Planejado (não implementado ainda)
- **Serviços**
  - GET `/api/services` - Listar serviços
  - GET `/api/services/:id` - Detalhes do serviço
- **Agendamentos**
  - POST `/api/bookings` - Criar agendamento
  - GET `/api/bookings` - Listar agendamentos
  - PATCH `/api/bookings/:id` - Atualizar agendamento
- **Pagamentos (Stripe)**
  - POST `/api/payments/create-intent`
  - POST `/api/payments/webhook`
- **Google Calendar**
  - POST `/api/calendar/events`
- **Notificações**
  - POST `/api/notifications/send` (WhatsApp + Email)

---

## 💡 Próximos Passos

1. ✅ Autenticação funcionando
2. ✅ Dados demo criados
3. ✅ Error handler implementado
4. 🔲 Criar endpoints de serviços
5. 🔲 Criar endpoints de agendamentos
6. 🔲 Implementar tela de catálogo de serviços
7. 🔲 Implementar sistema de carrinho
8. 🔲 Integrar Stripe
9. 🔲 Integrar Google Calendar
10. 🔲 Implementar notificações

---

## 📞 Precisa de Ajuda?

- Verifique o console do navegador (F12) para ver os logs detalhados
- Verifique o terminal do backend para erros do servidor
- Certifique-se de que ambos (backend E frontend) estão rodando
- Use as contas demo para testar

**Última atualização:** Novembro 2024
