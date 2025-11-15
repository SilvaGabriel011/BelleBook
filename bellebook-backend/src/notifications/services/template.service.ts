import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as Handlebars from 'handlebars';
import { EmailTemplate, EmailTemplateData } from '../types/email.types';

/**
 * Template Service
 * Handles loading and rendering of email templates using Handlebars
 */
@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly templatesPath = join(__dirname, '..', 'templates');
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    // Format currency
    Handlebars.registerHelper('currency', (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    });

    // Format date
    Handlebars.registerHelper('formatDate', (date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(dateObj);
    });

    // Format time
    Handlebars.registerHelper('formatTime', (date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    });

    // Conditional equals
    Handlebars.registerHelper('eq', (a: any, b: any) => a === b);
  }

  /**
   * Load and compile a template
   */
  private async loadTemplate(
    templateName: string,
  ): Promise<HandlebarsTemplateDelegate> {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      const templatePath = join(this.templatesPath, `${templateName}.html`);
      const templateContent = await readFile(templatePath, 'utf-8');
      const compiled = Handlebars.compile(templateContent);

      // Cache the compiled template
      this.templateCache.set(templateName, compiled);

      this.logger.debug(`Template loaded and cached: ${templateName}`);
      return compiled;
    } catch (error) {
      this.logger.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  /**
   * Render a template with data
   */
  async render(
    template: EmailTemplate,
    data: EmailTemplateData,
  ): Promise<string> {
    try {
      // Load the specific template
      const templateCompiled = await this.loadTemplate(template);

      // Add default data
      const enrichedData = {
        ...data,
        year: new Date().getFullYear(),
        unsubscribeUrl:
          data.unsubscribeUrl ||
          `${process.env.FRONTEND_URL}/settings/notifications`,
      };

      // Render the template content
      const content = templateCompiled(enrichedData);

      // Load and render base template
      const baseTemplate = await this.loadTemplate('base');
      const html = baseTemplate({
        title: this.getEmailTitle(template),
        content,
        ...enrichedData,
      });

      return html;
    } catch (error) {
      this.logger.error(`Failed to render template ${template}:`, error);
      throw error;
    }
  }

  /**
   * Generate plain text version from HTML
   */
  generatePlainText(html: string): string {
    return (
      html
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Decode HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  /**
   * Get email subject based on template
   */
  getEmailSubject(template: EmailTemplate, customerName?: string): string {
    const subjects: Record<EmailTemplate, string> = {
      [EmailTemplate.BOOKING_CONFIRMATION]: `🎉 Agendamento Confirmado - BelleBook`,
      [EmailTemplate.BOOKING_REMINDER]: `⏰ Lembrete: Seu agendamento está próximo!`,
      [EmailTemplate.BOOKING_CANCELLED]: `Agendamento Cancelado - BelleBook`,
      [EmailTemplate.PAYMENT_RECEIPT]: `✅ Pagamento Confirmado - BelleBook`,
      [EmailTemplate.REVIEW_REQUEST]: `⭐ Como foi sua experiência?`,
      [EmailTemplate.WELCOME]: `🎉 Bem-vinda ao BelleBook${customerName ? `, ${customerName}` : ''}!`,
      [EmailTemplate.PASSWORD_RESET]: `🔒 Redefinir sua Senha - BelleBook`,
    };

    return subjects[template];
  }

  /**
   * Get email title for base template
   */
  private getEmailTitle(template: EmailTemplate): string {
    const titles: Record<EmailTemplate, string> = {
      [EmailTemplate.BOOKING_CONFIRMATION]: 'Agendamento Confirmado',
      [EmailTemplate.BOOKING_REMINDER]: 'Lembrete de Agendamento',
      [EmailTemplate.BOOKING_CANCELLED]: 'Agendamento Cancelado',
      [EmailTemplate.PAYMENT_RECEIPT]: 'Comprovante de Pagamento',
      [EmailTemplate.REVIEW_REQUEST]: 'Avaliação de Serviço',
      [EmailTemplate.WELCOME]: 'Bem-vinda ao BelleBook',
      [EmailTemplate.PASSWORD_RESET]: 'Redefinir Senha',
    };

    return titles[template];
  }

  /**
   * Clear template cache (useful for development)
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logger.log('Template cache cleared');
  }
}
