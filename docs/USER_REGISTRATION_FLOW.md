# Fluxo de Cadastro e Solicitação de Roles - BelleBook

## 1. Visão Geral

Processo completo de registro com seleção de role e aprovação administrativa para Employee e Admin.

## 2. Fluxo de Usuário

### 2.1. Etapas

1. **Registro Básico**: Email, senha, nome, telefone
2. **Seleção de Role**: Customer (direto) | Employee/Admin (requer aprovação)
3. **Justificativa**: Se Employee/Admin, preencher formulário
4. **Aprovação**: Admin analisa e aprova/rejeita
5. **Ativação**: Conta ativada com role definido

### 2.2. Estados da Conta

```typescript
enum AccountStatus {
  ACTIVE = 'ACTIVE',              // Conta ativa normal
  PENDING_APPROVAL = 'PENDING_APPROVAL',  // Aguardando aprovação de role
  SUSPENDED = 'SUSPENDED',        // Conta suspensa
  REJECTED = 'REJECTED'           // Solicitação rejeitada
}
```

## 3. Backend - API Endpoints

### 3.1. POST /api/auth/register

Cria nova conta de usuário.

```typescript
interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;  // Inicial sempre CUSTOMER
}
```

### 3.2. POST /api/role-requests

Solicita mudança de role.

```typescript
interface CreateRoleRequestDto {
  requestedRole: UserRole.EMPLOYEE | UserRole.ADMIN;
  reason: string;  // Justificativa detalhada
}
```

### 3.3. GET /api/role-requests/my-request

Busca solicitação pendente do usuário.

### 3.4. GET /api/role-requests/pending (Admin only)

Lista todas solicitações pendentes.

### 3.5. PATCH /api/role-requests/:id/approve (Admin only)

Aprova solicitação.

```typescript
interface ApproveRequestDto {
  notes?: string;  // Notas do admin
}
```

### 3.6. PATCH /api/role-requests/:id/reject (Admin only)

Rejeita solicitação.

```typescript
interface RejectRequestDto {
  reason: string;  // Motivo da rejeição
}
```

## 4. Frontend - Componentes

### 4.1. RegisterPage

Formulário básico de registro (Step 1).

**Campos:**
- Nome completo
- Email
- Telefone (WhatsApp)
- Senha
- Confirmar senha

### 4.2. RoleSelectionStep

Seleção visual de tipo de conta (Step 2).

**Cards para cada role:**
- **Customer**: Ícone Sparkles, cor rosa, acesso imediato
- **Employee**: Ícone Scissors, cor roxa, requer aprovação
- **Admin**: Ícone Shield, cor azul, requer aprovação

### 4.3. RoleRequestForm

Formulário de justificativa para Employee/Admin (Step 3).

**Campos Employee:**
- Experiência profissional (textarea)
- Certificações e qualificações (textarea)
- Motivação (textarea)

**Campos Admin:**
- Justificativa detalhada (textarea)
- Departamento desejado (select)

### 4.4. PendingApprovalPage

Tela de aguardo com status em tempo real.

**Elementos:**
- Ícone de relógio animado
- Timeline de status
- Tempo estimado de análise
- Link para suporte

## 5. Notificações

### 5.1. Templates de Email

**Solicitação Enviada:**
```
Assunto: Solicitação Recebida - Conta {ROLE}

Olá {NOME},
Recebemos sua solicitação. Análise em até 48h.
```

**Aprovação:**
```
Assunto: 🎉 Conta Aprovada!

Parabéns {NOME}!
Sua conta {ROLE} foi aprovada.
[Acessar Dashboard]
```

**Rejeição:**
```
Assunto: Atualização de Solicitação

Olá {NOME},
Não pudemos aprovar neste momento.
Motivo: {REASON}
```

### 5.2. Push Notifications

Usar Firebase Cloud Messaging para notificações em tempo real.

## 6. Regras de Negócio

### 6.1. Restrições

- Customer pode solicitar apenas Employee
- Employee pode solicitar apenas Admin
- Admin só pode ser aprovado por Super Admin
- Apenas 1 solicitação pendente por vez
- Rate limit: 3 solicitações por dia

### 6.2. Validações

- Email único no sistema
- Telefone em formato válido
- Justificativa mínima: 50 caracteres
- Experiência (Employee): mínimo 100 caracteres

## 7. Segurança

### 7.1. Middleware

```typescript
// Bloqueia ações para contas PENDING_APPROVAL
@Injectable()
export class AccountStatusMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.user?.accountStatus === 'PENDING_APPROVAL') {
      const allowedRoutes = ['/auth/logout', '/users/profile', '/role-requests/my-request'];
      if (!allowedRoutes.includes(req.path)) {
        throw new ForbiddenException('Conta aguardando aprovação');
      }
    }
    next();
  }
}
```

### 7.2. Rate Limiting

```typescript
@Throttle({ default: { limit: 3, ttl: 86400 } }) // 3 por dia
async createRoleRequest() { }
```

## 8. Analytics

### 8.1. Métricas

- Taxa de conversão: registro → role request
- Tempo médio de aprovação
- Taxa de aprovação/rejeição por role
- Motivos mais comuns de rejeição
- Taxa de abandono no fluxo

### 8.2. Eventos

```typescript
trackEvent('role_request_created', { role, userAge });
trackEvent('role_request_approved', { role, approvalTime });
trackEvent('role_request_rejected', { role, reason });
```

## 9. Testes

### 9.1. Unitários

- Validação de DTOs
- Regras de negócio do service
- Guards e decorators

### 9.2. E2E

- Fluxo completo: registro → aprovação → login
- Tentativa de acesso não autorizado
- Múltiplas solicitações simultâneas

## 10. Deployment Checklist

- [ ] Criar super admin inicial via seed
- [ ] Configurar templates de email
- [ ] Configurar FCM para push notifications
- [ ] Configurar rate limiting
- [ ] Testar fluxo completo em staging
- [ ] Documentar processo para ops team
- [ ] Criar runbook para aprovações manuais

---

**Próximo**: Veja `ADMIN_DASHBOARD_SPEC.md` para detalhes do dashboard administrativo.
