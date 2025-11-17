import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreatePricingRuleDto {
  serviceId: string;
  name: string;
  description?: string;
  ruleType: string;
  conditions: Record<string, any>;
  adjustment: Record<string, any>;
  priority?: number;
  isActive?: boolean;
  validFrom?: Date;
  validUntil?: Date;
}

export interface UpdatePricingRuleDto {
  name?: string;
  description?: string;
  ruleType?: string;
  conditions?: Record<string, any>;
  adjustment?: Record<string, any>;
  priority?: number;
  isActive?: boolean;
  validFrom?: Date;
  validUntil?: Date;
}

@Injectable()
export class PricingRulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(serviceId?: string) {
    const where = serviceId ? { serviceId } : {};

    const rules = await this.prisma.pricingRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return rules.map((rule) => ({
      ...rule,
      conditions: JSON.parse(rule.conditions || '{}'),
      adjustment: JSON.parse(rule.adjustment || '{}'),
    }));
  }

  async findById(id: string) {
    const rule = await this.prisma.pricingRule.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!rule) {
      throw new NotFoundException('Regra de precificação não encontrada');
    }

    return {
      ...rule,
      conditions: JSON.parse(rule.conditions || '{}'),
      adjustment: JSON.parse(rule.adjustment || '{}'),
    };
  }

  async findByServiceId(serviceId: string) {
    const rules = await this.prisma.pricingRule.findMany({
      where: {
        serviceId,
        isActive: true,
      },
      orderBy: { priority: 'desc' },
    });

    return rules.map((rule) => ({
      ...rule,
      conditions: JSON.parse(rule.conditions || '{}'),
      adjustment: JSON.parse(rule.adjustment || '{}'),
    }));
  }

  async create(createDto: CreatePricingRuleDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: createDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    const { conditions, adjustment, ...rest } = createDto;

    const rule = await this.prisma.pricingRule.create({
      data: {
        ...rest,
        conditions: JSON.stringify(conditions),
        adjustment: JSON.stringify(adjustment),
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

    return {
      ...rule,
      conditions: JSON.parse(rule.conditions || '{}'),
      adjustment: JSON.parse(rule.adjustment || '{}'),
    };
  }

  async update(id: string, updateDto: UpdatePricingRuleDto) {
    const rule = await this.prisma.pricingRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('Regra de precificação não encontrada');
    }

    const { conditions, adjustment, ...rest } = updateDto;

    const updated = await this.prisma.pricingRule.update({
      where: { id },
      data: {
        ...rest,
        ...(conditions && { conditions: JSON.stringify(conditions) }),
        ...(adjustment && { adjustment: JSON.stringify(adjustment) }),
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

    return {
      ...updated,
      conditions: JSON.parse(updated.conditions || '{}'),
      adjustment: JSON.parse(updated.adjustment || '{}'),
    };
  }

  async remove(id: string) {
    const rule = await this.prisma.pricingRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('Regra de precificação não encontrada');
    }

    await this.prisma.pricingRule.delete({
      where: { id },
    });

    return { message: 'Regra de precificação excluída com sucesso' };
  }

  async calculatePrice(serviceId: string, context: Record<string, any> = {}): Promise<number> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    let basePrice = parseFloat(service.price.toString());

    const rules = await this.findByServiceId(serviceId);

    const now = new Date();
    const applicableRules = rules.filter((rule) => {
      if (!rule.isActive) return false;
      if (rule.validFrom && new Date(rule.validFrom) > now) return false;
      if (rule.validUntil && new Date(rule.validUntil) < now) return false;

      return this.matchesConditions(rule.conditions, context);
    });

    applicableRules.sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      basePrice = this.applyAdjustment(basePrice, rule.adjustment);
    }

    return Math.max(0, basePrice);
  }

  private matchesConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    if (conditions.dayOfWeek && context.dayOfWeek) {
      if (!conditions.dayOfWeek.includes(context.dayOfWeek)) return false;
    }

    if (conditions.timeRange && context.time) {
      const [start, end] = conditions.timeRange.split('-');
      if (context.time < start || context.time > end) return false;
    }

    if (conditions.season && context.season) {
      if (conditions.season !== context.season) return false;
    }

    return true;
  }

  private applyAdjustment(price: number, adjustment: Record<string, any>): number {
    const { type, value, operation } = adjustment;

    let adjustedPrice = price;

    if (type === 'percentage') {
      const change = (price * value) / 100;
      adjustedPrice = operation === 'increase' ? price + change : price - change;
    } else if (type === 'fixed') {
      adjustedPrice = operation === 'increase' ? price + value : price - value;
    }

    return adjustedPrice;
  }
}
