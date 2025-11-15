import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking } from '@prisma/client';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';

export interface BookingServiceItem {
  serviceId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface CreateBookingDto {
  userId: string;
  serviceId: string; // Main service for compatibility
  providerId?: string;
  services: BookingServiceItem[]; // Multiple services support
  scheduledAt: Date;
  duration: number;
  totalAmount: number;
  discount?: number;
  promoCode?: string;
  paymentMethod: string;
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    @Optional() private googleCalendarService?: GoogleCalendarService,
  ) {}

  // Buscar horários disponíveis para uma data
  async getAvailableSlots(
    serviceId: string,
    date: string,
  ): Promise<TimeSlot[]> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Horários de funcionamento (9h às 18h)
    const workingHours = [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
    ];

    // Buscar agendamentos existentes para esta data
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: {
          notIn: ['CANCELLED', 'COMPLETED'],
        },
      },
      select: {
        time: true,
      },
    });

    const bookedTimes = existingBookings.map((b) => b.time);

    // Calcular slots disponíveis
    const slots: TimeSlot[] = workingHours.map((time) => {
      // Verificar se já passou (para hoje)
      const now = new Date();
      const slotDate = new Date(`${date} ${time}`);
      const isPast = slotDate < now;

      // Verificar se está ocupado
      const isBooked = bookedTimes.includes(time);

      return {
        time,
        available: !isPast && !isBooked,
        reason: isPast
          ? 'Horário já passou'
          : isBooked
            ? 'Horário ocupado'
            : undefined,
      };
    });

    return slots;
  }

  // Criar novo agendamento
  async createBooking(data: CreateBookingDto): Promise<Booking> {
    // Validação: agendamento deve ser com no mínimo 2h de antecedência
    const now = new Date();
    const scheduledTime = new Date(data.scheduledAt);
    const hoursDiff = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 2) {
      throw new BadRequestException(
        'Agendamento deve ser feito com no mínimo 2 horas de antecedência'
      );
    }

    // Validação: máximo 5 serviços por agendamento
    if (data.services.length > 5) {
      throw new BadRequestException(
        'Máximo de 5 serviços por agendamento'
      );
    }

    // Validar horário comercial (8h - 20h)
    const hours = scheduledTime.getHours();
    if (hours < 8 || hours >= 20) {
      throw new BadRequestException(
        'Horário fora do horário comercial (8h - 20h)'
      );
    }

    // Validar promo code se fornecido
    if (data.promoCode) {
      const promoCode = await this.prisma.promoCode.findUnique({
        where: { code: data.promoCode },
      });

      if (!promoCode || !promoCode.isActive) {
        throw new BadRequestException('Código promocional inválido');
      }

      const now = new Date();
      if (now < promoCode.validFrom || now > promoCode.validUntil) {
        throw new BadRequestException('Código promocional expirado');
      }

      if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
        throw new BadRequestException(
          'Código promocional atingiu o limite de uso'
        );
      }

      if (promoCode.minAmount && data.totalAmount < promoCode.minAmount.toNumber()) {
        throw new BadRequestException(
          `Valor mínimo para este cupom é R$ ${promoCode.minAmount}`
        );
      }

      // Incrementar contador de uso
      await this.prisma.promoCode.update({
        where: { code: data.promoCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Verificar disponibilidade do provider se especificado
    if (data.providerId) {
      const provider = await this.prisma.user.findUnique({
        where: { id: data.providerId },
        include: { employeeProfile: true },
      });

      if (!provider || !provider.employeeProfile) {
        throw new NotFoundException('Profissional não encontrado');
      }

      if (!provider.employeeProfile.isAvailable) {
        throw new BadRequestException('Profissional não está disponível');
      }

      // Verificar se o provider já tem agendamento nesse horário
      const conflictingBooking = await this.prisma.booking.findFirst({
        where: {
          providerId: data.providerId,
          date: scheduledTime,
          status: {
            notIn: ['CANCELLED', 'COMPLETED'],
          },
        },
      });

      if (conflictingBooking) {
        throw new BadRequestException(
          'Profissional já possui agendamento neste horário'
        );
      }
    }

    // Buscar informações do serviço principal
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Criar o agendamento
    const booking = await this.prisma.booking.create({
      data: {
        userId: data.userId,
        serviceId: data.serviceId,
        providerId: data.providerId,
        services: JSON.stringify(data.services),
        date: scheduledTime,
        time: scheduledTime.toTimeString().slice(0, 5),
        duration: data.duration,
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'CASH' ? 'PENDING' : 'PAID',
        totalPaid: data.totalAmount,
        discount: data.discount || 0,
        promoCode: data.promoCode,
        notes: data.notes,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Criar eventos no Google Calendar (cliente e prestador)
    if (this.googleCalendarService) {
      try {
        await this.googleCalendarService.createBookingEvents(booking);
      } catch (error) {
        console.error('Erro ao criar eventos no Google Calendar:', error);
        // Não falhar o agendamento se o Google Calendar falhar
      }
    }

    // TODO: Enviar notificação de confirmação

    return booking;
  }

  // Buscar agendamentos do usuário
  async getUserBookings(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    });

    return bookings;
  }

  // Buscar próximo agendamento
  async getNextBooking(userId: string): Promise<Booking | null> {
    const now = new Date();

    const booking = await this.prisma.booking.findFirst({
      where: {
        userId,
        date: {
          gte: now,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return booking;
  }

  // Cancelar agendamento
  async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Agendamento já foi cancelado');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException(
        'Não é possível cancelar um agendamento concluído',
      );
    }

    // Verificar política de cancelamento (24h de antecedência)
    const bookingDate = new Date(
      `${booking.date.toISOString().split('T')[0]} ${booking.time}`,
    );
    const now = new Date();
    const hoursDiff =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new BadRequestException(
        'Cancelamentos devem ser feitos com no mínimo 24 horas de antecedência',
      );
    }

    // Atualizar status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    // TODO: Enviar notificação de cancelamento

    return updatedBooking;
  }

  // Reagendar
  async rescheduleBooking(
    bookingId: string,
    userId: string,
    newDate: string,
    newTime: string,
  ): Promise<Booking> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      throw new BadRequestException('Este agendamento não pode ser reagendado');
    }

    // Validar disponibilidade do novo horário
    const slots = await this.getAvailableSlots(booking.serviceId, newDate);
    const selectedSlot = slots.find((s) => s.time === newTime);

    if (!selectedSlot || !selectedSlot.available) {
      throw new BadRequestException('Novo horário não está disponível');
    }

    // Atualizar agendamento
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: new Date(newDate),
        time: newTime,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    // TODO: Enviar notificação de reagendamento

    return updatedBooking;
  }
}
