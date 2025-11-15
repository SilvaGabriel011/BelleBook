import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ValidatePromoCodeDto {
  code: string;
  totalAmount: number;
}

export interface PromoCodeResult {
  valid: boolean;
  discount: number;
  discountType: string;
  message?: string;
}

@Injectable()
export class PromoCodeService {
  constructor(private prisma: PrismaService) {}

  async validatePromoCode(
    data: ValidatePromoCodeDto,
  ): Promise<PromoCodeResult> {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (!promoCode) {
      return {
        valid: false,
        discount: 0,
        discountType: 'NONE',
        message: 'Código promocional não encontrado',
      };
    }

    if (!promoCode.isActive) {
      return {
        valid: false,
        discount: 0,
        discountType: 'NONE',
        message: 'Código promocional inativo',
      };
    }

    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      return {
        valid: false,
        discount: 0,
        discountType: 'NONE',
        message: 'Código promocional expirado',
      };
    }

    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return {
        valid: false,
        discount: 0,
        discountType: 'NONE',
        message: 'Código promocional atingiu o limite de uso',
      };
    }

    if (promoCode.minAmount && data.totalAmount < promoCode.minAmount.toNumber()) {
      return {
        valid: false,
        discount: 0,
        discountType: 'NONE',
        message: `Valor mínimo para este cupom é R$ ${promoCode.minAmount}`,
      };
    }

    // Calcular desconto
    let discount = 0;
    if (promoCode.type === 'PERCENTAGE') {
      discount = (data.totalAmount * promoCode.value.toNumber()) / 100;
    } else if (promoCode.type === 'FIXED') {
      discount = promoCode.value.toNumber();
    }

    return {
      valid: true,
      discount: Math.min(discount, data.totalAmount),
      discountType: promoCode.type,
      message: `Desconto de R$ ${discount.toFixed(2)} aplicado`,
    };
  }
}
