import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

type AccountStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';

interface UserWithAccountStatus {
  accountStatus?: AccountStatus;
}

@Injectable()
export class AccountStatusMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as unknown as UserWithAccountStatus | undefined;
    
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
      const allowedRoutes = ['/users/profile', '/auth/logout', '/role-requests'];
      const isAllowed = allowedRoutes.some(route => req.path.startsWith(route));
      
      if (!isAllowed) {
        throw new ForbiddenException(
          'Sua solicitação de mudança de role está pendente de aprovação.'
        );
      }
    }
    
    next();
  }
}
