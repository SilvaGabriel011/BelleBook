# Sistema RBAC e Dashboards Diferenciados - Índice de Implementação

## 📋 Visão Geral

Este conjunto de documentos detalha a arquitetura completa para implementação de um sistema de controle de acesso baseado em roles (RBAC) com dashboards diferenciados para cada tipo de usuário no BelleBook.

## 🎯 Problema a Resolver

1. ✅ Usuários que se cadastram devem escolher seu tipo de conta (Customer, Employee, Admin)
2. ✅ Contas Employee e Admin requerem aprovação por um admin existente
3. ✅ Admin e Employee devem ter dashboards próprios sem conteúdos promocionais
4. ✅ Admin deve ter ferramentas completas de gestão: clientes, usuários, agendamentos, chat

## 📚 Documentos da Arquitetura

### 1. [RBAC_CORE_ARCHITECTURE.md](./RBAC_CORE_ARCHITECTURE.md)
**Sistema Core de Permissões**

Cobre:
- ✅ Modelo de dados (Prisma schema) com roles e status de conta
- ✅ Enumerações: `UserRole`, `AccountStatus`
- ✅ Tabelas: `User`, `RoleRequest`, `EmployeeProfile`, `AdminProfile`
- ✅ Matriz completa de permissões por role
- ✅ Guards e decorators do NestJS
- ✅ Middleware de verificação de status
- ✅ Serviço de gerenciamento de roles
- ✅ Hierarquia de permissões (Super Admin → Admin → Employee → Customer)
- ✅ Considerações de segurança e audit trail

**Próximos passos:**
```bash
# 1. Atualizar schema
cd prisma
npx prisma migrate dev --name add_rbac_system

# 2. Criar seed com super admin
npx prisma db seed

# 3. Gerar Prisma Client
npx prisma generate
```

---

### 2. [USER_REGISTRATION_FLOW.md](./USER_REGISTRATION_FLOW.md)
**Fluxo de Cadastro e Aprovação**

Cobre:
- ✅ Jornada completa do usuário desde registro até aprovação
- ✅ 3 steps: Registro básico → Seleção de role → Justificativa (se necessário)
- ✅ Componentes React: `RegisterPage`, `RoleSelectionStep`, `RoleRequestForm`
- ✅ Tela de aguardo: `PendingApprovalPage` com status em tempo real
- ✅ Endpoints da API: `/auth/register`, `/role-requests/*`
- ✅ Templates de email para cada status
- ✅ Regras de negócio e validações
- ✅ Rate limiting e segurança

**Features principais:**
- Customer: Acesso imediato após registro
- Employee/Admin: Aguarda aprovação (status `PENDING_APPROVAL`)
- Notificações automáticas por email em cada etapa
- Sistema de justificativa com campos customizados

---

### 3. [ADMIN_DASHBOARD_SPEC.md](./ADMIN_DASHBOARD_SPEC.md)
**Dashboard Administrativo Completo**

Cobre:
- ✅ Estrutura de navegação (sidebar com 9 seções)
- ✅ **Overview**: KPIs, gráficos, ações rápidas
- ✅ **Solicitações**: Gestão de role requests (aprovar/rejeitar)
- ✅ **Usuários**: CRUD completo de clientes
- ✅ **Profissionais**: Gestão de employees
- ✅ **Agendamentos**: Calendário completo com todas as reservas
- ✅ **Chat**: Sistema centralizado de mensagens
- ✅ **Analytics**: Dashboards de métricas avançadas
- ✅ **Configurações**: Gerenciamento da plataforma
- ✅ Permissões granulares por admin
- ✅ Real-time updates via WebSocket
- ✅ Export de relatórios (CSV, Excel, PDF)
- ✅ Audit log de todas as ações administrativas

**Componentes reutilizáveis:**
- `StatCard` - Cards de métricas
- `DataTable` - Tabela com sorting/filtering
- `BookingsCalendar` - Calendário FullCalendar
- `Modal` - Modal genérico

---

### 4. [EMPLOYEE_DASHBOARD_SPEC.md](./EMPLOYEE_DASHBOARD_SPEC.md)
**Dashboard do Profissional**

Cobre:
- ✅ Dashboard focado em **produtividade** (zero promoções)
- ✅ **Home**: Próximos agendamentos, resumo do dia, avaliações
- ✅ **Agenda**: Calendário pessoal com bloqueios
- ✅ **Clientes**: Lista de clientes atendidos com histórico
- ✅ **Chat**: Comunicação 1-on-1 com clientes
- ✅ **Performance**: Analytics pessoais (receita, rating, ocupação)
- ✅ **Perfil**: Especialidades, portfólio, disponibilidade
- ✅ Notificações push específicas
- ✅ Fluxo de agendamento (aceitar/recusar, iniciar, concluir)
- ✅ Integrações: WhatsApp, Google Calendar, Pagamentos
- ✅ Mobile-first design

**Diferenças vs Cliente:**
| Cliente | Employee |
|---------|----------|
| Ver promoções | Ver próximos agendamentos |
| Buscar serviços | Gerenciar agenda |
| Acumular pontos | Ver métricas de performance |
| Comprar pacotes | Chat com clientes |

---

## 🚀 Ordem de Implementação Recomendada

### Phase 1: Backend Core (Semana 1-2)
```
1. ✅ Atualizar Prisma schema (roles, profiles, requests)
2. ✅ Criar migrations
3. ✅ Implementar RoleRequestService
4. ✅ Criar Guards e Decorators
5. ✅ Implementar endpoints de role-requests
6. ✅ Criar seed com super admin inicial
7. ✅ Testes unitários dos services
```

### Phase 2: Frontend - Registro e Aprovação (Semana 2-3)
```
1. ✅ Componente RegisterPage (Step 1)
2. ✅ Componente RoleSelectionStep (Step 2)
3. ✅ Componente RoleRequestForm (Step 3)
4. ✅ PendingApprovalPage
5. ✅ Integração com API
6. ✅ Validação com Zod
7. ✅ Testes E2E do fluxo completo
```

### Phase 3: Admin Dashboard (Semana 3-5)
```
1. ✅ Layout base com sidebar
2. ✅ Página Overview (KPIs)
3. ✅ Página Solicitações (role requests)
4. ✅ Página Usuários (CRUD)
5. ✅ Página Agendamentos (calendário)
6. ✅ Sistema de Chat
7. ✅ Analytics e relatórios
8. ✅ Configurações
9. ✅ WebSocket para real-time
10. ✅ Audit log
```

### Phase 4: Employee Dashboard (Semana 5-7)
```
1. ✅ Layout base
2. ✅ Home com próximos agendamentos
3. ✅ Agenda pessoal
4. ✅ Listagem de clientes
5. ✅ Chat com clientes
6. ✅ Dashboard de performance
7. ✅ Perfil e configurações
8. ✅ Notificações push
9. ✅ Integrações (WhatsApp, Calendar)
10. ✅ Onboarding
```

### Phase 5: Refinamento e Testes (Semana 7-8)
```
1. ✅ Testes E2E de todos os fluxos
2. ✅ Otimização de performance
3. ✅ Responsividade mobile
4. ✅ Documentação da API (Swagger)
5. ✅ Guias de uso para cada role
6. ✅ Deploy em staging
7. ✅ Testes de carga
8. ✅ Ajustes finais
```

## 🔐 Segurança

### Checklist de Segurança

- [ ] Validação de input em todos os endpoints
- [ ] Rate limiting em endpoints sensíveis
- [ ] Sanitização de dados antes de salvar
- [ ] Criptografia de dados sensíveis
- [ ] HTTPS obrigatório em produção
- [ ] Tokens JWT com expiração
- [ ] Refresh tokens
- [ ] Audit log de ações administrativas
- [ ] Proteção contra CSRF
- [ ] Proteção contra XSS
- [ ] Backup automático diário
- [ ] Política de senhas fortes
- [ ] 2FA para admins (futuro)

## 📊 Métricas de Sucesso

### KPIs do Sistema RBAC

1. **Tempo médio de aprovação**: < 24 horas
2. **Taxa de aprovação Employee**: > 70%
3. **Taxa de aprovação Admin**: 100% manual
4. **Uptime do sistema**: > 99.9%
5. **Tempo de resposta médio**: < 200ms

### KPIs dos Dashboards

1. **Uso diário por Admin**: > 80%
2. **Uso diário por Employee**: > 90%
3. **Satisfação (NPS)**: > 8/10
4. **Bugs críticos**: 0
5. **Tempo de carregamento**: < 2s

## 🎨 Design System

### Cores por Role

```css
/* Customer */
--customer-primary: #FF6B9D;
--customer-secondary: #FFC8DD;

/* Employee */
--employee-primary: #9D4EDD;
--employee-secondary: #C77DFF;

/* Admin */
--admin-primary: #0047FF;
--admin-secondary: #4895EF;
```

### Componentes Compartilhados

Localização: `frontend/components/shared/`

- `Button.tsx` - Botão com variantes
- `Input.tsx` - Input com validação
- `Select.tsx` - Select customizado
- `Modal.tsx` - Modal genérico
- `Card.tsx` - Card container
- `Avatar.tsx` - Avatar de usuário
- `Badge.tsx` - Badge de status
- `Tabs.tsx` - Tabs navegação
- `Table.tsx` - Tabela com sorting
- `Calendar.tsx` - Calendário
- `Chart.tsx` - Wrapper para gráficos

## 📝 Migrations

### Ordem de Execução

```bash
# 1. Adicionar enums e campos
npx prisma migrate dev --name add_user_roles

# 2. Criar tabelas de perfil
npx prisma migrate dev --name add_profiles

# 3. Criar tabela de solicitações
npx prisma migrate dev --name add_role_requests

# 4. Ajustes finais
npx prisma migrate dev --name rbac_final
```

## 🧪 Testes

### Cobertura Esperada

- **Unit Tests**: > 80%
- **Integration Tests**: > 70%
- **E2E Tests**: 100% dos fluxos críticos

### Casos de Teste Críticos

1. ✅ Registro de Customer (aprovação automática)
2. ✅ Solicitação de Employee (aprovação manual)
3. ✅ Solicitação de Admin (super admin only)
4. ✅ Rejeição de solicitação
5. ✅ Tentativa de acesso não autorizado
6. ✅ Super admin cria novo admin
7. ✅ Employee vê apenas seus dados
8. ✅ Admin vê todos os dados
9. ✅ Chat entre employee e customer
10. ✅ Aprovação de agendamento

## 📞 Suporte e Troubleshooting

### Problemas Comuns

**1. Usuário não recebe email de aprovação**
- Verificar configuração SendGrid
- Checar logs de email
- Confirmar email na whitelist

**2. Admin não consegue aprovar solicitação**
- Verificar se é super admin (para role Admin)
- Checar permissões no AdminProfile
- Ver logs de erro no backend

**3. Dashboard não carrega**
- Verificar token JWT
- Confirmar role no token
- Checar permissões de rota

**4. WebSocket desconecta**
- Verificar configuração de CORS
- Confirmar URL do WebSocket
- Checar logs do servidor

## 🔄 Próximas Iterações (Post-MVP)

### Futuras Features

1. **Sistema de Notificações Avançado**
   - Central de notificações
   - Preferências granulares
   - Digest diário

2. **Analytics Avançado**
   - ML para previsão de demanda
   - Recomendações personalizadas
   - Detecção de anomalias

3. **Multi-tenancy**
   - Múltiplos estabelecimentos
   - Sub-contas
   - White-label

4. **Mobile Apps Nativos**
   - React Native
   - Push notifications nativas
   - Modo offline

5. **Automações**
   - Auto-aprovação com critérios
   - Workflows customizados
   - Integração com Zapier

## 📚 Recursos Adicionais

### Documentação Técnica

- [NestJS Guards](https://docs.nestjs.com/guards)
- [Prisma RBAC](https://www.prisma.io/docs/guides/database/rbac)
- [NextJS Authentication](https://nextjs.org/docs/authentication)
- [FullCalendar React](https://fullcalendar.io/docs/react)

### Repositórios de Referência

- [NestJS RBAC Example](https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt)
- [NextJS Dashboard Template](https://github.com/vercel/nextjs-dashboard)

---

## ✅ Checklist Final

Antes do deploy em produção:

- [ ] Todos os testes passando
- [ ] Documentação completa
- [ ] Seed com super admin configurado
- [ ] Variáveis de ambiente configuradas
- [ ] SSL/HTTPS ativo
- [ ] Backup automático configurado
- [ ] Monitoring ativo (Sentry, LogRocket)
- [ ] Analytics configurado
- [ ] Email templates testados
- [ ] Mobile responsivo testado
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Acessibilidade validada (WCAG 2.1 AA)
- [ ] LGPD compliance
- [ ] Termos de uso atualizados
- [ ] Política de privacidade atualizada
- [ ] Treinamento da equipe concluído

---

**Versão**: 1.0.0  
**Última Atualização**: Novembro 2024  
**Autores**: Arquitetura BelleBook  
**Status**: ✅ Pronto para Implementação
