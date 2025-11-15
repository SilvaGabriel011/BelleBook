import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface ServiceFilters {
  category?: string;
  gender?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  promoPrice?: number;
  duration: number;
  images: string[];
  isActive?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  promoPrice?: number;
  duration?: number;
  images?: string[];
  isActive?: boolean;
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Enhanced findAll with pagination and filtering
  async findAll(filters: ServiceFilters = {}) {
    const {
      category,
      gender,
      minPrice,
      maxPrice,
      search,
      sort = 'name',
      page = 1,
      limit = 12,
    } = filters;

    const where: Prisma.ServiceWhereInput = {
      isActive: true,
    };

    // Category filter
    if (category) {
      where.categoryId = category;
    }

    // Gender filter
    if (gender) {
      where.gender = gender;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {
        gte: minPrice?.toString() || '0',
        lte: maxPrice?.toString() || '99999',
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Sort order
    let orderBy: Prisma.ServiceOrderByWithRelationInput = { name: 'asc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'popular') orderBy = { isPopular: 'desc' };

    // Pagination
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          variants: { where: { isActive: true } },
          _count: {
            select: {
              reviews: true,
              bookings: true,
            },
          },
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    // Calculate average ratings
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
      }),
    );

    return {
      data: servicesWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get popular services
  async findPopular(limit: number = 10) {
    const services = await this.prisma.service.findMany({
      where: {
        isActive: true,
        OR: [{ isPopular: true }],
      },
      orderBy: [{ isPopular: 'desc' }, { bookings: { _count: 'desc' } }],
      take: limit,
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

    return Promise.all(
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
      }),
    );
  }

  // Get service packages
  async findPackages() {
    const packages = await this.prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return packages.map((pkg) => ({
      ...pkg,
      services: JSON.parse(pkg.services || '[]'),
    }));
  }

  // Get service with full details including variants
  async findByIdWithDetails(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { where: { isActive: true } },
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
          take: 20,
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Calculate average rating
    const avgRating = service.reviews.length
      ? service.reviews.reduce((sum, r) => sum + r.rating, 0) /
        service.reviews.length
      : 0;

    // Format reviews
    const formattedReviews = service.reviews.map((review) => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : [],
    }));

    return {
      ...service,
      images: JSON.parse(service.images || '[]'),
      averageRating: Number(avgRating.toFixed(1)),
      reviews: formattedReviews,
    };
  }

  // Get service variants
  async findVariants(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const variants = await this.prisma.serviceVariant.findMany({
      where: {
        serviceId,
        isActive: true,
      },
      orderBy: { price: 'asc' },
    });

    return variants;
  }

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
      }),
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
      ? service.reviews.reduce((sum, r) => sum + r.rating, 0) /
        service.reviews.length
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

    return categories.map((category) => ({
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

    return services.map((service) => ({
      ...service,
      images: JSON.parse(service.images || '[]'),
    }));
  }

  async create(createServiceDto: CreateServiceDto) {
    const { images, price, promoPrice, ...rest } = createServiceDto;

    // Verificar se a categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id: createServiceDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const service = await this.prisma.service.create({
      data: {
        ...rest,
        price: price.toString(),
        promoPrice: promoPrice ? promoPrice.toString() : null,
        images: JSON.stringify(images || []),
      },
      include: {
        category: true,
      },
    });

    return {
      ...service,
      images: JSON.parse(service.images || '[]'),
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Se categoryId for fornecido, verificar se existe
    if (updateServiceDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateServiceDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada');
      }
    }

    const { images, price, promoPrice, ...rest } = updateServiceDto;

    const updated = await this.prisma.service.update({
      where: { id },
      data: {
        ...rest,
        ...(price !== undefined && { price: price.toString() }),
        ...(promoPrice !== undefined && {
          promoPrice: promoPrice ? promoPrice.toString() : null,
        }),
        ...(images && { images: JSON.stringify(images) }),
      },
      include: {
        category: true,
      },
    });

    return {
      ...updated,
      images: JSON.parse(updated.images || '[]'),
    };
  }

  async remove(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verificar se há agendamentos ativos
    const activeBookings = service.bookings.filter(
      (booking) =>
        booking.status === 'PENDING' || booking.status === 'CONFIRMED',
    );

    if (activeBookings.length > 0) {
      throw new BadRequestException(
        'Não é possível excluir serviço com agendamentos ativos. Desative-o ao invés disso.',
      );
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return { message: 'Serviço excluído com sucesso' };
  }

  async toggleActive(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const updated = await this.prisma.service.update({
      where: { id },
      data: {
        isActive: !service.isActive,
      },
      include: {
        category: true,
      },
    });

    return {
      ...updated,
      images: JSON.parse(updated.images || '[]'),
    };
  }
}
