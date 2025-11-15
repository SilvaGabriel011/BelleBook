import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogEntry {
  adminId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async log(entry: AuditLogEntry) {
    return this.prisma.auditLog.create({
      data: {
        ...entry,
        changes: entry.changes ? JSON.stringify(entry.changes) : null,
      },
    });
  }

  async getLogs(filters?: {
    adminId?: string;
    resource?: string;
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters?.adminId) where.adminId = filters.adminId;
    if (filters?.resource) where.resource = filters.resource;
    if (filters?.resourceId) where.resourceId = filters.resourceId;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              displayName: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs: logs.map((log) => ({
        ...log,
        changes: log.changes ? JSON.parse(log.changes) : null,
      })),
      total,
      page: Math.floor((filters?.skip || 0) / (filters?.take || 50)) + 1,
      pageSize: filters?.take || 50,
    };
  }

  async getAdminActivity(adminId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.auditLog.groupBy({
      by: ['action'],
      where: {
        adminId,
        createdAt: { gte: startDate },
      },
      _count: true,
    });
  }
}
