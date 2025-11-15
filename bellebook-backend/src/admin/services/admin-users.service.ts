import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole, AccountStatus } from '@prisma/client';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AdminUsersService {
  constructor(
    private prisma: PrismaService,
    private auditLog: AuditLogService,
  ) {}

  async getAllUsers(filters?: {
    role?: UserRole;
    status?: AccountStatus;
    search?: string;
    skip?: number;
    take?: number;
    sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: any = {};

    if (filters?.role) where.role = filters.role;
    if (filters?.status) where.accountStatus = filters.status;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { displayName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          displayName: true,
          phone: true,
          avatar: true,
          role: true,
          accountStatus: true,
          createdAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        orderBy,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page: Math.floor((filters?.skip || 0) / (filters?.take || 50)) + 1,
      pageSize: filters?.take || 50,
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            service: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        reviews: {
          include: {
            service: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        employeeProfile: true,
        adminProfile: true,
        roleRequests: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async suspendUser(userId: string, adminId: string, reason: string, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException('Não é possível suspender administradores');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'SUSPENDED' },
    });

    await this.auditLog.log({
      adminId,
      action: 'SUSPEND_USER',
      resource: 'User',
      resourceId: userId,
      changes: { reason, previousStatus: user.accountStatus },
      ipAddress,
      userAgent,
    });

    return { message: 'Usuário suspensou com sucesso' };
  }

  async reactivateUser(userId: string, adminId: string, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: 'ACTIVE' },
    });

    await this.auditLog.log({
      adminId,
      action: 'REACTIVATE_USER',
      resource: 'User',
      resourceId: userId,
      changes: { previousStatus: user.accountStatus },
      ipAddress,
      userAgent,
    });

    return { message: 'Usuário reativado com sucesso' };
  }

  async getAllEmployees(filters?: {
    search?: string;
    isAvailable?: boolean;
    minRating?: number;
    skip?: number;
    take?: number;
  }) {
    const where: any = {
      role: 'EMPLOYEE',
    };

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const employeeWhere: any = {};
    if (filters?.isAvailable !== undefined) {
      employeeWhere.isAvailable = filters.isAvailable;
    }
    if (filters?.minRating !== undefined) {
      employeeWhere.rating = { gte: filters.minRating };
    }

    const [employees, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          employeeProfile: {
            where: employeeWhere,
          },
        },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          employeeProfile: {
            rating: 'desc',
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      employees: employees.filter((e) => e.employeeProfile),
      total,
      page: Math.floor((filters?.skip || 0) / (filters?.take || 50)) + 1,
      pageSize: filters?.take || 50,
    };
  }

  async updateEmployeeProfile(
    userId: string,
    adminId: string,
    data: {
      specialties?: string[];
      bio?: string;
      workSchedule?: Record<string, any>;
      isAvailable?: boolean;
    },
    ipAddress?: string,
    userAgent?: string,
  ) {
    const employee = await this.prisma.employeeProfile.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw new NotFoundException('Perfil de profissional não encontrado');
    }

    const updateData: any = {};
    if (data.specialties) updateData.specialties = JSON.stringify(data.specialties);
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.workSchedule) updateData.workSchedule = JSON.stringify(data.workSchedule);
    if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;

    await this.prisma.employeeProfile.update({
      where: { userId },
      data: updateData,
    });

    await this.auditLog.log({
      adminId,
      action: 'UPDATE_EMPLOYEE_PROFILE',
      resource: 'EmployeeProfile',
      resourceId: userId,
      changes: data,
      ipAddress,
      userAgent,
    });

    return { message: 'Perfil atualizado com sucesso' };
  }

  async getUserStats() {
    const [totalUsers, activeUsers, employees, admins, suspendedUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { accountStatus: 'ACTIVE' } }),
      this.prisma.user.count({ where: { role: 'EMPLOYEE' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.user.count({ where: { accountStatus: 'SUSPENDED' } }),
    ]);

    return {
      totalUsers,
      activeUsers,
      employees,
      admins,
      suspendedUsers,
    };
  }
}
