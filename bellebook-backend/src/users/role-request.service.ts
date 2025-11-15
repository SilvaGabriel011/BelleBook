import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RoleRequestService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async requestRoleChange(
    userId: string,
    requestedRole: UserRole,
    reason: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Customer não pode solicitar ADMIN diretamente
    if (user.role === UserRole.CUSTOMER && requestedRole === UserRole.ADMIN) {
      throw new BadRequestException(
        'Você deve primeiro se tornar EMPLOYEE antes de solicitar ADMIN',
      );
    }

    // Não pode solicitar o mesmo role que já tem
    if (user.role === requestedRole) {
      throw new BadRequestException('Você já possui este role');
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

    // Notificar usuário e admins
    await this.notificationsService.sendRoleRequestCreated(
      user.email,
      user.displayName || user.name,
      requestedRole,
    );

    await this.notificationsService.notifyAdminsNewRequest(
      request.id,
      user.displayName || user.name,
      requestedRole,
    );

    return request;
  }

  async approveRoleRequest(requestId: string, adminId: string, notes?: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: { adminProfile: true },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException(
        'Apenas administradores podem aprovar solicitações',
      );
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
    if (
      request.requestedRole === UserRole.ADMIN &&
      !admin.adminProfile?.isSuperAdmin
    ) {
      throw new BadRequestException(
        'Apenas super administradores podem aprovar solicitações de ADMIN',
      );
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
          specialties: JSON.stringify([]),
          workSchedule: JSON.stringify({}),
        },
      });
    } else if (request.requestedRole === UserRole.ADMIN) {
      await this.prisma.adminProfile.create({
        data: {
          userId: request.userId,
          permissions: JSON.stringify(['read', 'write', 'delete']),
          isSuperAdmin: false,
        },
      });
    }

    // Notificar usuário sobre aprovação
    await this.notificationsService.sendRoleRequestApproved(
      request.user.email,
      request.user.displayName || request.user.name,
      request.requestedRole,
    );

    return { message: 'Solicitação aprovada com sucesso' };
  }

  async rejectRoleRequest(requestId: string, adminId: string, reason: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new BadRequestException(
        'Apenas administradores podem rejeitar solicitações',
      );
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

    // Notificar usuário sobre rejeição
    const rejectedUser = await this.prisma.user.findUnique({
      where: { id: request.userId },
    });

    if (rejectedUser) {
      await this.notificationsService.sendRoleRequestRejected(
        rejectedUser.email,
        rejectedUser.displayName || rejectedUser.name,
        reason,
      );
    }

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
            name: true,
            displayName: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserRequests(userId: string) {
    return this.prisma.roleRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRequestById(requestId: string) {
    const request = await this.prisma.roleRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            displayName: true,
            avatar: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            displayName: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Solicitação não encontrada');
    }

    return request;
  }
}
