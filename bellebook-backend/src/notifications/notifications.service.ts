import { Injectable, Logger } from '@nestjs/common';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /**
   * Envia notificação de solicitação de role criada
   */
  async sendRoleRequestCreated(
    userEmail: string,
    userName: string,
    requestedRole: string,
  ): Promise<void> {
    const template = this.getRoleRequestCreatedTemplate(userName, requestedRole);
    
    this.logger.log(`Sending role request created email to ${userEmail}`);
    // TODO: Integrate with SendGrid or other email service
    // await this.sendEmail(userEmail, template);
    
    console.log('📧 Email (Solicitação Criada):', {
      to: userEmail,
      subject: template.subject,
      content: template.text,
    });
  }

  /**
   * Envia notificação de aprovação de solicitação
   */
  async sendRoleRequestApproved(
    userEmail: string,
    userName: string,
    approvedRole: string,
  ): Promise<void> {
    const template = this.getRoleRequestApprovedTemplate(userName, approvedRole);
    
    this.logger.log(`Sending role request approved email to ${userEmail}`);
    // TODO: Integrate with SendGrid or other email service
    
    console.log('📧 Email (Solicitação Aprovada):', {
      to: userEmail,
      subject: template.subject,
      content: template.text,
    });
  }

  /**
   * Envia notificação de rejeição de solicitação
   */
  async sendRoleRequestRejected(
    userEmail: string,
    userName: string,
    reason: string,
  ): Promise<void> {
    const template = this.getRoleRequestRejectedTemplate(userName, reason);
    
    this.logger.log(`Sending role request rejected email to ${userEmail}`);
    // TODO: Integrate with SendGrid or other email service
    
    console.log('📧 Email (Solicitação Rejeitada):', {
      to: userEmail,
      subject: template.subject,
      content: template.text,
    });
  }

  /**
   * Notifica admins sobre nova solicitação pendente
   */
  async notifyAdminsNewRequest(
    requestId: string,
    userName: string,
    requestedRole: string,
  ): Promise<void> {
    this.logger.log(`Notifying admins about new role request: ${requestId}`);
    // TODO: Send push notification or email to all admins
    
    console.log('🔔 Notificação para Admins:', {
      title: 'Nova Solicitação de Role',
      message: `${userName} solicitou role ${requestedRole}`,
      requestId,
    });
  }

  // Template methods
  private getRoleRequestCreatedTemplate(
    userName: string,
    requestedRole: string,
  ): EmailTemplate {
    const roleName = this.getRoleName(requestedRole);
    
    return {
      subject: `Solicitação Recebida - Conta ${roleName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B9D;">Solicitação Recebida! 💼</h2>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Recebemos sua solicitação para se tornar <strong>${roleName}</strong>.</p>
          <p>Nossa equipe irá analisar sua solicitação em até <strong>48 horas</strong>.</p>
          <p>Você receberá uma notificação assim que houver uma atualização.</p>
          <br>
          <p style="color: #666; font-size: 12px;">
            Se você tiver alguma dúvida, entre em contato com nosso suporte.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">BelleBook - Sua beleza, nossa prioridade</p>
        </div>
      `,
      text: `
Olá ${userName},

Recebemos sua solicitação para se tornar ${roleName}.

Nossa equipe irá analisar sua solicitação em até 48 horas.
Você receberá uma notificação assim que houver uma atualização.

Se você tiver alguma dúvida, entre em contato com nosso suporte.

---
BelleBook - Sua beleza, nossa prioridade
      `.trim(),
    };
  }

  private getRoleRequestApprovedTemplate(
    userName: string,
    approvedRole: string,
  ): EmailTemplate {
    const roleName = this.getRoleName(approvedRole);
    
    return {
      subject: `🎉 Conta Aprovada!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Parabéns! 🎉</h2>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Sua conta como <strong>${roleName}</strong> foi <strong style="color: #4CAF50;">aprovada</strong>!</p>
          <p>Agora você tem acesso a todas as funcionalidades exclusivas do seu novo role.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="display: inline-block; background-color: #FF6B9D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Acessar Dashboard
          </a>
          <br><br>
          <p style="color: #666; font-size: 14px;">
            Explore suas novas permissões e comece a aproveitar!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">BelleBook - Sua beleza, nossa prioridade</p>
        </div>
      `,
      text: `
Parabéns ${userName}!

Sua conta como ${roleName} foi aprovada! 🎉

Agora você tem acesso a todas as funcionalidades exclusivas do seu novo role.

Acesse o dashboard: ${process.env.FRONTEND_URL}/dashboard

Explore suas novas permissões e comece a aproveitar!

---
BelleBook - Sua beleza, nossa prioridade
      `.trim(),
    };
  }

  private getRoleRequestRejectedTemplate(
    userName: string,
    reason: string,
  ): EmailTemplate {
    return {
      subject: 'Atualização de Solicitação',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B9D;">Atualização sobre sua Solicitação</h2>
          <p>Olá <strong>${userName}</strong>,</p>
          <p>Agradecemos seu interesse, mas infelizmente não pudemos aprovar sua solicitação neste momento.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <strong>Motivo:</strong><br>
            ${reason}
          </div>
          <p>Você pode fazer uma nova solicitação no futuro, após atender aos requisitos necessários.</p>
          <p style="color: #666; font-size: 14px;">
            Se você tiver dúvidas, nossa equipe de suporte está à disposição.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">BelleBook - Sua beleza, nossa prioridade</p>
        </div>
      `,
      text: `
Olá ${userName},

Agradecemos seu interesse, mas infelizmente não pudemos aprovar sua solicitação neste momento.

Motivo:
${reason}

Você pode fazer uma nova solicitação no futuro, após atender aos requisitos necessários.

Se você tiver dúvidas, nossa equipe de suporte está à disposição.

---
BelleBook - Sua beleza, nossa prioridade
      `.trim(),
    };
  }

  private getRoleName(role: string): string {
    const roleNames: Record<string, string> = {
      CUSTOMER: 'Cliente',
      EMPLOYEE: 'Profissional',
      ADMIN: 'Administrador',
    };
    return roleNames[role] || role;
  }
}
