import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateServiceAttributeDto {
  key: string;
  name: string;
  description?: string;
  valueType?: string;
  options?: string[];
  isActive?: boolean;
}

export interface UpdateServiceAttributeDto {
  key?: string;
  name?: string;
  description?: string;
  valueType?: string;
  options?: string[];
  isActive?: boolean;
}

@Injectable()
export class ServiceAttributesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const attributes = await this.prisma.serviceAttribute.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            assignments: true,
          },
        },
      },
    });

    return attributes.map((attr) => ({
      ...attr,
      options: attr.options ? JSON.parse(attr.options) : null,
      usageCount: attr._count.assignments,
    }));
  }

  async findById(id: string) {
    const attribute = await this.prisma.serviceAttribute.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo não encontrado');
    }

    return {
      ...attribute,
      options: attribute.options ? JSON.parse(attribute.options) : null,
    };
  }

  async findByServiceId(serviceId: string) {
    const assignments = await this.prisma.serviceAttributeAssignment.findMany({
      where: { serviceId },
      include: {
        attribute: true,
      },
    });

    return assignments.map((assignment) => ({
      id: assignment.attribute.id,
      key: assignment.attribute.key,
      name: assignment.attribute.name,
      valueType: assignment.attribute.valueType,
      value: assignment.value,
    }));
  }

  async create(createDto: CreateServiceAttributeDto) {
    const { options, ...rest } = createDto;

    const attribute = await this.prisma.serviceAttribute.create({
      data: {
        ...rest,
        options: options ? JSON.stringify(options) : null,
      },
    });

    return {
      ...attribute,
      options: attribute.options ? JSON.parse(attribute.options) : null,
    };
  }

  async update(id: string, updateDto: UpdateServiceAttributeDto) {
    const attribute = await this.prisma.serviceAttribute.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo não encontrado');
    }

    const { options, ...rest } = updateDto;

    const updated = await this.prisma.serviceAttribute.update({
      where: { id },
      data: {
        ...rest,
        ...(options !== undefined && { options: options ? JSON.stringify(options) : null }),
      },
    });

    return {
      ...updated,
      options: updated.options ? JSON.parse(updated.options) : null,
    };
  }

  async remove(id: string) {
    const attribute = await this.prisma.serviceAttribute.findUnique({
      where: { id },
      include: {
        assignments: true,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo não encontrado');
    }

    if (attribute.assignments.length > 0) {
      await this.prisma.serviceAttribute.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: 'Atributo desativado pois está em uso' };
    }

    await this.prisma.serviceAttribute.delete({
      where: { id },
    });

    return { message: 'Atributo excluído com sucesso' };
  }
}
