import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateServiceTemplateDto {
  name: string;
  description?: string;
  categoryId?: string;
  defaultFields: Record<string, any>;
  fieldSchema?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateServiceTemplateDto {
  name?: string;
  description?: string;
  categoryId?: string;
  defaultFields?: Record<string, any>;
  fieldSchema?: Record<string, any>;
  isActive?: boolean;
}

@Injectable()
export class ServiceTemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const templates = await this.prisma.serviceTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return templates.map((template) => ({
      ...template,
      defaultFields: JSON.parse(template.defaultFields || '{}'),
      fieldSchema: template.fieldSchema ? JSON.parse(template.fieldSchema) : null,
    }));
  }

  async findById(id: string) {
    const template = await this.prisma.serviceTemplate.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado');
    }

    return {
      ...template,
      defaultFields: JSON.parse(template.defaultFields || '{}'),
      fieldSchema: template.fieldSchema ? JSON.parse(template.fieldSchema) : null,
    };
  }

  async create(createDto: CreateServiceTemplateDto) {
    const { defaultFields, fieldSchema, ...rest } = createDto;

    const template = await this.prisma.serviceTemplate.create({
      data: {
        ...rest,
        defaultFields: JSON.stringify(defaultFields),
        fieldSchema: fieldSchema ? JSON.stringify(fieldSchema) : null,
      },
    });

    return {
      ...template,
      defaultFields: JSON.parse(template.defaultFields || '{}'),
      fieldSchema: template.fieldSchema ? JSON.parse(template.fieldSchema) : null,
    };
  }

  async update(id: string, updateDto: UpdateServiceTemplateDto) {
    const template = await this.prisma.serviceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado');
    }

    const { defaultFields, fieldSchema, ...rest } = updateDto;

    const updated = await this.prisma.serviceTemplate.update({
      where: { id },
      data: {
        ...rest,
        ...(defaultFields && { defaultFields: JSON.stringify(defaultFields) }),
        ...(fieldSchema !== undefined && { fieldSchema: fieldSchema ? JSON.stringify(fieldSchema) : null }),
      },
    });

    return {
      ...updated,
      defaultFields: JSON.parse(updated.defaultFields || '{}'),
      fieldSchema: updated.fieldSchema ? JSON.parse(updated.fieldSchema) : null,
    };
  }

  async remove(id: string) {
    const template = await this.prisma.serviceTemplate.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (!template) {
      throw new NotFoundException('Template não encontrado');
    }

    if (template.services.length > 0) {
      await this.prisma.serviceTemplate.update({
        where: { id },
        data: { isActive: false },
      });
      return { message: 'Template desativado pois possui serviços associados' };
    }

    await this.prisma.serviceTemplate.delete({
      where: { id },
    });

    return { message: 'Template excluído com sucesso' };
  }
}
