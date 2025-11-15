import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreatePromoBannerDto {
  title: string;
  description?: string;
  image: string;
  link?: string;
  order?: number;
  validFrom?: Date;
  validUntil?: Date;
}

export interface UpdatePromoBannerDto {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
  validFrom?: Date;
  validUntil?: Date;
}

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    const now = new Date();
    return this.prisma.promoBanner.findMany({
      where: {
        isActive: true,
        OR: [
          {
            AND: [{ validFrom: { lte: now } }, { validUntil: { gte: now } }],
          },
          {
            validFrom: null,
            validUntil: null,
          },
        ],
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findAll() {
    return this.prisma.promoBanner.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.promoBanner.findUnique({
      where: { id },
    });
  }

  async create(data: CreatePromoBannerDto) {
    return this.prisma.promoBanner.create({
      data: {
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdatePromoBannerDto) {
    return this.prisma.promoBanner.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.promoBanner.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const banner = await this.prisma.promoBanner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new Error('Banner not found');
    }

    return this.prisma.promoBanner.update({
      where: { id },
      data: {
        isActive: !banner.isActive,
      },
    });
  }
}
