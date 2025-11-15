# Phase 6: WhatsApp Notifications

**Duration**: 4 days | **Priority**: MEDIUM

## Setup with Twilio

```bash
npm install twilio
```

**Env**: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`

## Message Templates

### 1. Booking Confirmation
```
✅ Agendamento Confirmado - BelleBook

Olá {name}!

📅 {date}
🕐 {time}
💆‍♀️ {service}
💰 R$ {amount}

Código: {bookingId}

Ver detalhes: {url}
```

### 2. Reminder (48h before)
```
🌸 Lembrete de Agendamento

Olá {name}!

Seu agendamento é amanhã às {time}

📋 {service}
📍 BelleBook Spa

Reagendar: {url}
```

### 3. Review Request
```
⭐ Como foi sua experiência?

Olá {name}!

Adoraríamos saber sua opinião sobre o {service}

Avaliar agora: {url}

Ganhe +25 pontos! 🎁
```

## Implementation

Create `notifications/whatsapp.service.ts`:

```typescript
async sendMessage(to: string, body: string) {
  return this.client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+55${to}`,
    body,
  });
}
```

## User Preferences

Add to User model:
```prisma
notificationPreferences Json? @default("{ \"email\": true, \"whatsapp\": true }")
```

Users can opt-in/out in profile settings.

## Compliance

- Get explicit opt-in before sending
- Include opt-out instructions
- Respect quiet hours (no messages 22h-8h)
- Follow LGPD regulations

**Next**: [Testing & Deployment](./TESTING_AND_DEPLOYMENT.md)
