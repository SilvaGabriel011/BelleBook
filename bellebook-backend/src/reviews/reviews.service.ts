import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateReviewDto {
  userId: string;
  serviceId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewDto) {
    // Check if review already exists
    const existing = await this.prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    });

    if (existing) {
      throw new Error('Avaliação já existe para este agendamento');
    }

    return this.prisma.review.create({
      data: {
        ...data,
        images: data.images ? JSON.stringify(data.images) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findFeatured(limit: number = 10) {
    return this.prisma.review.findMany({
      where: {
        rating: { gte: 4 },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByService(serviceId: string) {
    return this.prisma.review.findMany({
      where: { serviceId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
