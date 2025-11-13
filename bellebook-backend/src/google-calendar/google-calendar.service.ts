import { Injectable, BadRequestException } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Booking } from '@prisma/client';

export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: { email: string; displayName?: string }[];
  reminders?: {
    useDefault: boolean;
    overrides?: { method: string; minutes: number }[];
  };
}

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: calendar_v3.Calendar;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Configurar OAuth2 Client
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  // Gerar URL para autenticação OAuth
  generateAuthUrl(userId: string, isProvider = false): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    // Adicionar state para identificar se é cliente ou prestador
    const state = JSON.stringify({ userId, isProvider });

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'consent', // Força consentimento para obter refresh token
    });
  }

  // Salvar tokens de acesso
  async saveTokens(
    userId: string,
    tokens: any,
    isProvider = false,
  ): Promise<void> {
    const tokenField = isProvider ? 'googleTokensProvider' : 'googleTokens';

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        [tokenField]: JSON.stringify(tokens),
      },
    });
  }

  // Obter cliente OAuth autenticado para um usuário
  async getAuthenticatedClient(
    userId: string,
    isProvider = false,
  ): Promise<OAuth2Client> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const tokenField = isProvider ? 'googleTokensProvider' : 'googleTokens';
    const tokens = user[tokenField];

    if (!tokens) {
      throw new BadRequestException(
        `${isProvider ? 'Prestador' : 'Cliente'} não autenticado com Google Calendar`,
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    oauth2Client.setCredentials(JSON.parse(tokens));

    // Verificar se o token expirou e renovar se necessário
    if (
      oauth2Client.credentials.expiry_date &&
      oauth2Client.credentials.expiry_date <= Date.now()
    ) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      await this.saveTokens(userId, credentials, isProvider);
    }

    return oauth2Client;
  }

  // Criar evento no Google Calendar
  async createCalendarEvent(
    booking: Booking & {
      service?: any;
      user?: any;
    },
    userId: string,
    isProvider = false,
  ): Promise<string> {
    try {
      const authClient = await this.getAuthenticatedClient(userId, isProvider);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      // Montar data e hora do evento
      const startDate = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(
        endDate.getMinutes() + (booking.service?.duration || 60),
      );

      // Montar descrição do evento
      const description = `
Serviço: ${booking.service?.name || 'Serviço de Beleza'}
${booking.service?.category?.name ? `Categoria: ${booking.service.category.name}` : ''}
${booking.user?.name ? `Cliente: ${booking.user.name}` : ''}
${booking.user?.phone ? `Telefone: ${booking.user.phone}` : ''}
${booking.notes ? `\nObservações: ${booking.notes}` : ''}

Status: ${booking.status}
Valor: R$ ${booking.totalPaid}

---
Agendamento realizado via BelleBook
      `.trim();

      // Preparar o evento
      const event: GoogleCalendarEvent = {
        summary: isProvider
          ? `${booking.service?.name} - ${booking.user?.name}`
          : `${booking.service?.name} - BelleBook`,
        description,
        location: this.configService.get('BUSINESS_ADDRESS') || 'A confirmar',
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 horas antes
            { method: 'popup', minutes: 60 }, // 1 hora antes
          ],
        },
      };

      // Se for o prestador, adicionar o cliente como convidado
      if (isProvider && booking.user?.email) {
        event.attendees = [
          {
            email: booking.user.email,
            displayName: booking.user.name,
          },
        ];
      }

      // Se for o cliente, adicionar o prestador como convidado
      if (!isProvider) {
        const providerEmail = this.configService.get('PROVIDER_EMAIL');
        if (providerEmail) {
          event.attendees = [
            {
              email: providerEmail,
              displayName:
                this.configService.get('PROVIDER_NAME') || 'Prestador',
            },
          ];
        }
      }

      // Criar o evento
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event as any,
        sendUpdates: 'all', // Envia convites por email
      });

      return response.data.id || '';
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
      throw new BadRequestException('Erro ao criar evento no calendário');
    }
  }

  // Criar evento em ambas as agendas (cliente e prestador)
  async createBookingEvents(
    booking: Booking & { service?: any; user?: any },
  ): Promise<{
    clientEventId?: string;
    providerEventId?: string;
  }> {
    const result: { clientEventId?: string; providerEventId?: string } = {};

    try {
      // Criar evento na agenda do cliente
      if (booking.userId) {
        try {
          result.clientEventId = await this.createCalendarEvent(
            booking,
            booking.userId,
            false,
          );
        } catch (error) {
          console.log('Cliente não autenticado com Google Calendar');
        }
      }

      // Criar evento na agenda do prestador
      const providerId = this.configService.get('PROVIDER_USER_ID');
      if (providerId) {
        try {
          result.providerEventId = await this.createCalendarEvent(
            booking,
            providerId,
            true,
          );
        } catch (error) {
          console.log('Prestador não autenticado com Google Calendar');
        }
      }

      // Salvar IDs dos eventos no banco
      if (result.clientEventId || result.providerEventId) {
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: {
            googleEventId: result.clientEventId,
            googleProviderEventId: result.providerEventId,
          } as any,
        });
      }

      return result;
    } catch (error) {
      console.error('Erro ao criar eventos:', error);
      throw error;
    }
  }

  // Atualizar evento no Google Calendar
  async updateCalendarEvent(
    eventId: string,
    booking: Booking & { service?: any; user?: any },
    userId: string,
    isProvider = false,
  ): Promise<void> {
    try {
      const authClient = await this.getAuthenticatedClient(userId, isProvider);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      const startDate = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDate = new Date(startDate);
      endDate.setMinutes(
        endDate.getMinutes() + (booking.service?.duration || 60),
      );

      const event: GoogleCalendarEvent = {
        summary: isProvider
          ? `${booking.service?.name} - ${booking.user?.name}`
          : `${booking.service?.name} - BelleBook`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
      };

      await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: event as any,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw new BadRequestException('Erro ao atualizar evento no calendário');
    }
  }

  // Cancelar evento no Google Calendar
  async cancelCalendarEvent(
    eventId: string,
    userId: string,
    isProvider = false,
  ): Promise<void> {
    try {
      const authClient = await this.getAuthenticatedClient(userId, isProvider);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all', // Notifica participantes sobre o cancelamento
      });
    } catch (error) {
      console.error('Erro ao cancelar evento:', error);
      // Se o evento não existir, não é erro crítico
      if (error.code !== 404) {
        throw new BadRequestException('Erro ao cancelar evento no calendário');
      }
    }
  }

  // Cancelar eventos em ambas as agendas
  async cancelBookingEvents(booking: any): Promise<void> {
    // Cancelar na agenda do cliente
    if (booking.googleEventId && booking.userId) {
      try {
        await this.cancelCalendarEvent(
          booking.googleEventId,
          booking.userId,
          false,
        );
      } catch (error) {
        console.log('Erro ao cancelar evento do cliente:', error);
      }
    }

    // Cancelar na agenda do prestador
    if (booking.googleProviderEventId) {
      const providerId = this.configService.get('PROVIDER_USER_ID');
      if (providerId) {
        try {
          await this.cancelCalendarEvent(
            booking.googleProviderEventId,
            providerId,
            true,
          );
        } catch (error) {
          console.log('Erro ao cancelar evento do prestador:', error);
        }
      }
    }
  }

  // Buscar horários ocupados do prestador
  async getProviderBusySlots(date: Date): Promise<string[]> {
    try {
      const providerId = this.configService.get('PROVIDER_USER_ID');
      if (!providerId) return [];

      const authClient = await this.getAuthenticatedClient(providerId, true);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Buscar eventos do dia
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const busySlots: string[] = [];

      if (response.data.items) {
        response.data.items.forEach((event) => {
          if (event.start?.dateTime) {
            const eventTime = new Date(event.start.dateTime);
            const hours = eventTime.getHours().toString().padStart(2, '0');
            const minutes = eventTime.getMinutes().toString().padStart(2, '0');
            busySlots.push(`${hours}:${minutes}`);

            // Adicionar slots de 30 em 30 minutos durante a duração do evento
            if (event.end?.dateTime) {
              const endTime = new Date(event.end.dateTime);
              const duration =
                (endTime.getTime() - eventTime.getTime()) / (1000 * 60); // em minutos

              for (let i = 30; i < duration; i += 30) {
                const slotTime = new Date(eventTime);
                slotTime.setMinutes(slotTime.getMinutes() + i);
                const h = slotTime.getHours().toString().padStart(2, '0');
                const m = slotTime.getMinutes().toString().padStart(2, '0');
                busySlots.push(`${h}:${m}`);
              }
            }
          }
        });
      }

      return busySlots;
    } catch (error) {
      console.error('Erro ao buscar horários ocupados:', error);
      return [];
    }
  }
}
