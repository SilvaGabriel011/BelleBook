import { Controller, Get, Query, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { GoogleCalendarService } from './google-calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  // Iniciar processo de autenticação OAuth
  @Get('auth')
  @UseGuards(JwtAuthGuard)
  async startAuth(@Request() req, @Query('isProvider') isProvider?: string) {
    const isProviderBool = isProvider === 'true';
    const authUrl = this.googleCalendarService.generateAuthUrl(
      req.user.id,
      isProviderBool,
    );

    return { url: authUrl };
  }

  // Callback do OAuth
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const stateData = JSON.parse(state);
      const { userId, isProvider } = stateData;

      // Trocar código por tokens
      const oauth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      const { tokens } = await oauth2Client.getToken(code);

      // Salvar tokens
      await this.googleCalendarService.saveTokens(userId, tokens, isProvider);

      // Redirecionar de volta para o frontend
      const redirectUrl = isProvider
        ? `${process.env.FRONTEND_URL}/settings?google=connected&type=provider`
        : `${process.env.FRONTEND_URL}/settings?google=connected&type=client`;

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Erro no callback OAuth:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/settings?google=error`,
      );
    }
  }

  // Verificar status de conexão
  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getConnectionStatus(@Request() req) {
    const user = await req.user;

    return {
      clientConnected: !!user.googleTokens,
      providerConnected: !!user.googleTokensProvider,
    };
  }

  // Buscar horários ocupados do prestador
  @Get('busy-slots')
  async getBusySlots(@Query('date') date: string) {
    const busySlots = await this.googleCalendarService.getProviderBusySlots(
      new Date(date),
    );

    return { slots: busySlots };
  }
}
