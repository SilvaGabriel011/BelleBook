import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface ServiceFilters {
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findByCategory(categoryId: string, filters: ServiceFilters = {}) {
    const where: Prisma.ServiceWhereInput = {
      categoryId,
      isActive: true,
    };

    // Aplicar filtros de preço
    if (filters.minPrice || filters.maxPrice) {
      where.price = {
        gte: filters.minPrice || 0,
        lte: filters.maxPrice || 99999,
      };
    }

    // Aplicar busca
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    // Definir ordenação
    let orderBy: Prisma.ServiceOrderByWithRelationInput = { name: 'asc' };
    
    if (filters.sort === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (filters.sort === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (filters.sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const services = await this.prisma.service.findMany({
      where,
      orderBy,
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    // Calcular média de avaliações
    const servicesWithRating = await Promise.all(
      services.map(async (service) => {
        const reviews = await this.prisma.review.findMany({
          where: { serviceId: service.id },
          select: { rating: true },
        });

        const avgRating = reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        return {
          ...service,
          images: JSON.parse(service.images || '[]'),
          averageRating: Number(avgRating.toFixed(1)),
          reviewsCount: service._count.reviews,
          bookingsCount: service._count.bookings,
        };
      })
    );

    return servicesWithRating;
  }

  async findById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Calcular média de avaliações
    const avgRating = service.reviews.length
      ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
      : 0;

    return {
      ...service,
      images: JSON.parse(service.images || '[]'),
      averageRating: Number(avgRating.toFixed(1)),
    };
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            services: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return categories.map(category => ({
      ...category,
      servicesCount: category._count.services,
    }));
  }

  async searchServices(query: string) {
    const services = await this.prisma.service.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          {
            category: {
              name: { contains: query },
            },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 20,
    });

    return services.map(service => ({
      ...service,
      images: JSON.parse(service.images || '[]'),
    }));
  }
}
