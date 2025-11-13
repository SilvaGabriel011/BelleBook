# 📋 Brief para Próxima Sessão com Claude

## 🎯 Contexto Atual

**Projeto:** BelleBook - Plataforma de agendamento de serviços de beleza

**Status:** Em fase de pivotamento para Web-First

**Serviços:** Unha, Sobrancelha, Depilação

**Inspiração:** Espaço Laser (5 telas de referência fornecidas)

---

## ✅ O Que Já Foi Feito

### Estrutura Base (Antiga - Mobile-First)
- ✅ Projeto React Native/Expo criado
- ✅ Firebase configurado (precisa de credenciais)
- ✅ Sistema de erro handling completo (80+ códigos)
- ✅ Navegação básica
- ✅ Design system inicial
- ✅ Error Boundary implementado

### Documentação Criada
- ✅ `WEB_FIRST_ROADMAP.md` - Roadmap completo (10 fases)
- ✅ `FIREBASE_SETUP.md` - Guia de setup do Firebase
- ✅ `ERROR_HANDLING_GUIDE.md` - Sistema de erros
- ✅ `QUICK_START.md` - Início rápido

### Decisões de Design
- ✅ UI Design Reference salvo em memória
- ✅ Features mapeadas das imagens
- ✅ Paleta de cores definida
- ✅ Componentes identificados

---

## 🔄 Mudança de Estratégia: WEB-FIRST

### Por Quê?
- Desenvolvimento mais rápido
- Debug mais fácil
- Depois apenas responsividade para mobile

### Nova Stack
```
React 18 + TypeScript
TailwindCSS
React Router
Redux Toolkit
Firebase
```

---

## 🚀 PRÓXIMA SESSÃO: FASE 1

### Objetivo: Setup Web Puro

#### Tarefas (2-3 horas)
1. [ ] Criar novo projeto React com Vite
2. [ ] Configurar TailwindCSS + Design System
3. [ ] Setup React Router
4. [ ] Configurar Redux
5. [ ] Migrar Firebase config
6. [ ] Criar estrutura de pastas web
7. [ ] Componentes base (Button, Card, Input)
8. [ ] Layout (Header, Footer, Navigation)
9. [ ] Página Home básica
10. [ ] App rodando em localhost:5173

#### Comando Inicial
```bash
cd d:\BelleBook\BelleBook
npm create vite@latest apps/web -- --template react-ts
cd apps/web
npm install
npm install react-router-dom @reduxjs/toolkit react-redux
npm install firebase
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react date-fns
npx tailwindcss init -p
```

#### Resultado Esperado
✅ App web rodando
✅ Design system aplicado
✅ Roteamento funcional
✅ Componentes base prontos

---

## 📁 Estrutura de Pastas Nova

```
apps/web/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── services/
│   │   ├── booking/
│   │   └── common/
│   ├── pages/
│   ├── features/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── App.tsx
├── public/
└── package.json
```

---

## 🎨 Design System (Cores Definidas)

```css
Primárias:
--blue-primary: #0047FF
--orange-cta: #FF6B00

Neutros:
--gray-50: #F9FAFB
--gray-500: #6B7280
--gray-900: #111827
```

---

## 📱 Features Prioritárias (10 Fases)

1. **Setup** ← VOCÊ ESTÁ AQUI
2. Autenticação (Login/Register/Perfil)
3. Catálogo de Serviços + Favoritos
4. Carrinho + Checkout + Stripe
5. Sistema de Agendamentos + Pacotes
6. Google Calendar Integration
7. Promoções + Banners + Indicação
8. Dashboard Admin
9. Performance + SEO
10. Adaptação Mobile

---

## 🔑 Informações Importantes

### Firebase
- Config em: `apps/mobile/src/config/firebase.config.ts`
- **Precisa de credenciais reais** (placeholders agora)
- Ver `FIREBASE_SETUP.md` para instruções

### Memórias Salvas
- ✅ Design Reference do Espaço Laser
- ✅ Features mapeadas das 5 telas
- ✅ Paleta de cores
- ✅ Componentes necessários

### Arquivos Importantes
- `WEB_FIRST_ROADMAP.md` - **LEIA PRIMEIRO**
- `apps/mobile/ERROR_HANDLING_GUIDE.md` - Sistema de erros
- `FIREBASE_SETUP.md` - Firebase setup

---

## 💬 Como Começar a Próxima Sessão

### Diga ao Claude:

```
"Olá! Vamos continuar o projeto BelleBook.

Leia:
1. WEB_FIRST_ROADMAP.md
2. NEXT_SESSION_BRIEF.md

Estamos na FASE 1: Setup Web-First.

Objetivo: Criar aplicação React pura com Vite, TailwindCSS, 
e estrutura completa.

Vamos começar?"
```

---

## 📊 Estimativa de Tempo

| Fase | Tempo | Status |
|------|-------|--------|
| 1 - Setup | 2-3h | 🔵 PRÓXIMA |
| 2 - Auth | 3-4h | ⚪ |
| 3 - Catálogo | 3-4h | ⚪ |
| 4 - E-commerce | 4-5h | ⚪ |
| 5 - Booking | 4-5h | ⚪ |
| 6 - Calendar | 3-4h | ⚪ |
| 7 - Marketing | 3-4h | ⚪ |
| 8 - Admin | 4-5h | ⚪ |
| 9 - Otimização | 2-3h | ⚪ |
| 10 - Mobile | 3-4h | ⚪ |

**Total:** ~30-40 horas

---

## ⚠️ Problemas Conhecidos

1. **Firebase Error** - Precisa adicionar credenciais reais
2. **Mobile-First Atual** - Vamos criar novo projeto web
3. **Expo não necessário** - Web puro agora

---

## 🎯 Meta Final

Uma aplicação web completa que se parece com as imagens do Espaço Laser, com:
- ✅ Autenticação completa
- ✅ Catálogo de serviços
- ✅ Sistema de agendamentos
- ✅ Pagamentos com Stripe
- ✅ Google Calendar sync
- ✅ Sistema de pontos/fidelidade
- ✅ Promoções e banners
- ✅ Dashboard admin

---

## 📞 Lembrete

**SEMPRE comece a próxima sessão lendo:**
1. `WEB_FIRST_ROADMAP.md`
2. `NEXT_SESSION_BRIEF.md` (este arquivo)

Isso garante continuidade e contexto completo.

---

**Última Atualização:** Novembro 2025  
**Próxima Ação:** Criar projeto React com Vite
