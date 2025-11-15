# Sistema RBAC - Arquitetura Core do BelleBook

## 1. Visão Geral

Este documento detalha a arquitetura do sistema de controle de acesso baseado em papéis (RBAC - Role-Based Access Control) para a plataforma BelleBook, implementando três níveis de permissão com workflow de aprovação para roles privilegiadas.

## 2. Modelo de Dados

### 2.1. Enumeração de Roles

```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',      // Cliente final que agenda serviços
  EMPLOYEE = 'EMPLOYEE',      // Profissional que presta serviços
  ADMIN = 'ADMIN'             // Administrador com permissões completas
}
```

### 2.2. Schema Prisma Atualizado

```prisma
// prisma/schema.prisma

enum UserRole {
  CUSTOMER
  EMPLOYEE
  ADMIN
}

enum AccountStatus {
  ACTIVE
  PENDING_APPROVAL
  SUSPENDED
  REJECTED
}

model User {
  id                String        @id @default(uuid())
  email             String        @unique
  displayName       String?
  role              UserRole      @default(CUSTOMER)
  accountStatus     AccountStatus @default(ACTIVE)
  avatarUrl         String?
  timezone          String?
  phoneNumber       String?
  
  // Audit fields
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  lastLoginAt       DateTime?
  
  // Relacionamentos
  appointments      Appointment[]
  favorites         Favorite[]
  employeeProfile   EmployeeProfile?
  adminProfile      AdminProfile?
  roleRequests      RoleRequest[]
  approvedRequests  RoleRequest[]     @relation("ApprovedBy")
  chatMessages      ChatMessage[]
  chatParticipants  ChatParticipant[]
  
  @@map("users")
}

model EmployeeProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  specialties     String[] // Array de especialidades: ["unha", "sobrancelha"]
  bio             String?
  workSchedule    Json     // Horários de trabalho estruturados
  rating          Float    @default(0)
  totalServices   Int      @default(0)
  isAvailable     Boolean  @default(true)
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("employee_profiles")
}

model AdminProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  permissions     String[] // Permissões específicas
  department      String?  // Ex: "Operações", "Financeiro", "TI"
  isSuperAdmin    Boolean  @default(false) // Top-level admin
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("admin_profiles")
}

model RoleRequest {
  id              String        @id @default(uuid())
  userId          String
  requestedRole   UserRole
  currentRole     UserRole
  status          String        @default("PENDING") // PENDING, APPROVED, REJECTED
  requestReason   String        // Justificativa do usuário
  adminNotes      String?       // Notas do admin que analisou
  
  approvedById    String?
  approvedAt      DateTime?
  
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  approvedBy      User?         @relation("ApprovedBy", fields: [approvedById], references: [id])
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  @@map("role_requests")
}
```

## 3. Matriz de Permissões

### 3.1. Permissões por Role

| Feature | CUSTOMER | EMPLOYEE | ADMIN |
|---------|----------|----------|-------|
| **Agendamentos** |
| Criar agendamento próprio | ✅ | ✅ | ✅ |
| Ver agendamentos próprios | ✅ | ✅ | ✅ |
| Ver todos agendamentos | ❌ | ❌ | ✅ |
| Cancelar/remarcar próprio | ✅ | ✅ | ✅ |
| Cancelar/remarcar qualquer | ❌ | ❌ | ✅ |
| **Serviços** |
| Ver catálogo | ✅ | ✅ | ✅ |
| Criar/editar serviços | ❌ | ❌ | ✅ |
| Ver promoções | ✅ | ❌ | ✅ |
| **Usuários** |
| Ver próprio perfil | ✅ | ✅ | ✅ |
| Editar próprio perfil | ✅ | ✅ | ✅ |
| Ver lista de clientes | ❌ | ✅* | ✅ |
| Ver lista de employees | ❌ | ❌ | ✅ |
| Gerenciar usuários | ❌ | ❌ | ✅ |
| **Chat** |
| Chat com profissional | ✅ | ✅ | ✅ |
| Ver todos os chats | ❌ | ❌ | ✅ |
| **Sistema** |
| Aprovar role requests | ❌ | ❌ | ✅ |
| Acessar analytics | ❌ | ✅** | ✅ |
| Gerenciar configurações | ❌ | ❌ | ✅ |

*Employee vê apenas clientes que agendaram com ele  
**Employee vê apenas analytics pessoais

### 3.2. Hierarquia de Permissões

```
ADMIN (Super Admin) → Top-level, cria outros admins
  ↓
ADMIN (Regular) → Gerencia employees e customers
  ↓
EMPLOYEE → Gerencia apenas seus agendamentos
  ↓
CUSTOMER → Acesso básico
```

## 4. Guards e Decorators (NestJS)

### 4.1. Role Guard

```typescript
// backend/src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Verifica se a conta está ativa
    if (user.accountStatus !== 'ACTIVE') {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### 4.2. Custom Decorators

```typescript
// backend/src/auth/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// backend/src/auth/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### 4.3. Uso nos Controllers

```typescript
// backend/src/users/users.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  
  // Apenas admins
  @Get('all')
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.findAll();
  }
  
  // Admin e Employee
  @Get('customers')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  async getCustomers(@CurrentUser() user) {
    if (user.role === UserRole.EMPLOYEE) {
      // Employee vê apenas seus clientes
      return this.usersService.getEmployeeCustomers(user.id);
    }
    // Admin vê todos
    return this.usersService.getAllCustomers();
  }
  
  // Qualquer usuário autenticado
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    return this.usersService.findById(user.id);
  }
}
```

## 5. Middleware de Verificação de Status

### 5.1. Account Status Middleware

```typescript
// backend/src/auth/middleware/account-status.middleware.ts

import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccountStatusMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    
    if (!user) {
      return next();
    }
    
    // Bloqueia contas suspensas
    if (user.accountStatus === 'SUSPENDED') {
      throw new ForbiddenException('Sua conta está suspensa. Entre em contato com o suporte.');
    }
    
    // Bloqueia ações para contas pendentes de aprovação
    if (user.accountStatus === 'PENDING_APPROVAL') {
      // Permite apenas visualização do próprio perfil
      const allowedRoutes = ['/users/profile', '/auth/logout'];
      if (!allowedRoutes.includes(req.path)) {
        throw new ForbiddenException(
          'Sua solicitação de mudança de role está pendente de aprovação.'
        );
      }
    }
    
    next();
  }
}
```

## 6. Serviço de Gerenciamento de Roles

### 6.1. Role Request Service

```typescript
// backend/src/users/role-request.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class RoleRequestService {
  constructor(private prisma: PrismaService) {}

  async requestRoleChange(userId: string, requestedRole: UserRole, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // Customer não pode solicitar ADMIN diretamente
    if (user.role === UserRole.CUSTOMER && requestedRole === UserRole.ADMIN) {
      throw new BadRequestException(
        'Você deve primeiro se tornar EMPLOYEE antes de solicitar ADMIN'
      );
    }
    
    // Verifica se já existe uma solicitação pendente
    const existingRequest = await this.prisma.roleRequest.findFirst({
      where: {
        userId,
        status: 'PENDING',
      },
    });
    
    if (existingRequest) {
      throw new BadRequestException('Você já possui uma solicitação pendente');
    }
    
    // Cria a solicitação
    const request = await this.prisma.roleRequest.create({
      data: {
        userId,
        requestedRole,
        currentRole: user.role,
        requestReason: reason,
        status: 'PENDING',
      },
    });
    
    // Atualiza status da conta para PENDING_APPROVAL
    await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'PENDING_APPROVAL' },
    });
    
    // TODO: Notificar admins via email/push notification
    
    return request;
  }

  async approveRoleRequest(requestId: string, adminId: string, notes?: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: { adminProfile: true },
    });
    
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('Apenas administradores podem aprovar solicitações');
    }
    
    const request = await this.prisma.roleRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });
    
    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }
    
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Esta solicitação já foi processada');
    }
    
    // Se está solicitando ADMIN, apenas super admins podem aprovar
    if (request.requestedRole === UserRole.ADMIN && !admin.adminProfile?.isSuperAdmin) {
      throw new BadRequestException('Apenas super administradores podem aprovar solicitações de ADMIN');
    }
    
    // Atualiza a solicitação
    await this.prisma.roleRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvedById: adminId,
        approvedAt: new Date(),
        adminNotes: notes,
      },
    });
    
    // Atualiza o role do usuário
    await this.prisma.user.update({
      where: { id: request.userId },
      data: {
        role: request.requestedRole,
        accountStatus: 'ACTIVE',
      },
    });
    
    // Cria perfil específico do role
    if (request.requestedRole === UserRole.EMPLOYEE) {
      await this.prisma.employeeProfile.create({
        data: {
          userId: request.userId,
          specialties: [],
          workSchedule: {},
        },
      });
    } else if (request.requestedRole === UserRole.ADMIN) {
      await this.prisma.adminProfile.create({
        data: {
          userId: request.userId,
          permissions: ['read', 'write', 'delete'],
          isSuperAdmin: false,
        },
      });
    }
    
    // TODO: Notificar usuário via email/push
    
    return { message: 'Solicitação aprovada com sucesso' };
  }

  async rejectRoleRequest(requestId: string, adminId: string, reason: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException('Apenas administradores podem rejeitar solicitações');
    }
    
    const request = await this.prisma.roleRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!request || request.status !== 'PENDING') {
      throw new BadRequestException('Solicitação inválida');
    }
    
    await this.prisma.roleRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvedById: adminId,
        approvedAt: new Date(),
        adminNotes: reason,
      },
    });
    
    // Restaura status da conta
    await this.prisma.user.update({
      where: { id: request.userId },
      data: { accountStatus: 'ACTIVE' },
    });
    
    // TODO: Notificar usuário
    
    return { message: 'Solicitação rejeitada' };
  }

  async getPendingRequests() {
    return this.prisma.roleRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

## 7. Frontend - Type Definitions

### 7.1. Types

```typescript
// frontend/lib/types/auth.types.ts

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  accountStatus: AccountStatus;
  avatarUrl: string | null;
  timezone: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface RoleRequest {
  id: string;
  userId: string;
  requestedRole: UserRole;
  currentRole: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestReason: string;
  adminNotes: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
```

## 8. Considerações de Segurança

### 8.1. Princípios Implementados

1. **Principle of Least Privilege**: Cada role tem apenas as permissões necessárias
2. **Defense in Depth**: Validação em múltiplas camadas (guards, middleware, service)
3. **Audit Trail**: Todas as mudanças de role são registradas com aprovador e timestamp
4. **Two-Person Rule**: Mudanças críticas (ADMIN) requerem super admin

### 8.2. Rate Limiting

```typescript
// backend/src/users/role-request.controller.ts

import { Throttle } from '@nestjs/throttler';

@Controller('role-requests')
export class RoleRequestController {
  
  @Post()
  @Throttle({ default: { limit: 3, ttl: 86400 } }) // 3 tentativas por dia
  async createRequest(@Body() dto: CreateRoleRequestDto, @CurrentUser() user) {
    return this.roleRequestService.requestRoleChange(
      user.id,
      dto.requestedRole,
      dto.reason
    );
  }
}
```

## 9. Métricas e Monitoramento

### 9.1. Eventos a Monitorar

- `role_request_created` - Nova solicitação de mudança de role
- `role_request_approved` - Solicitação aprovada
- `role_request_rejected` - Solicitação rejeitada
- `unauthorized_access_attempt` - Tentativa de acesso não autorizado
- `account_suspended` - Conta suspensa
- `super_admin_action` - Qualquer ação realizada por super admin

### 9.2. Alertas

- Múltiplas solicitações rejeitadas do mesmo usuário
- Tentativas de acesso não autorizado
- Criação de super admins
- Suspensões de conta

## 10. Próximos Passos

1. Implementar migração do Prisma
2. Criar seeds com usuário super admin inicial
3. Implementar DTOs de validação
4. Criar testes unitários e e2e
5. Documentar APIs com Swagger
6. Implementar notificações (email/push)
7. Criar dashboard de monitoramento

---

**Autor**: Arquitetura BelleBook  
**Versão**: 1.0.0  
**Última Atualização**: Novembro 2024
