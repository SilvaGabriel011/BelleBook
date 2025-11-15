# 📅 Configuração Google Calendar - BelleBook

## ✨ Visão Geral

O BelleBook agora possui **integração completa bidirecional** com o Google Calendar, permitindo:

✅ **Sincronização Dupla**: Eventos criados tanto na agenda do **cliente** quanto do **prestador de serviço**
✅ **Notificações Automáticas**: Lembretes por email e popup
✅ **Gerenciamento Completo**: Criar, atualizar, cancelar e reagendar
✅ **Disponibilidade em Tempo Real**: Verifica horários ocupados do prestador

---

## 🚀 Como Configurar

### 1️⃣ **Criar Projeto no Google Cloud Console**

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Clique em "Criar Projeto"
3. Nome: `BelleBook` 
4. Aguarde a criação

### 2️⃣ **Ativar Google Calendar API**

1. No menu lateral, vá em **APIs e Serviços** > **Biblioteca**
2. Pesquise por "Google Calendar API"
3. Clique e depois em **ATIVAR**

### 3️⃣ **Configurar OAuth 2.0**

1. Vá em **APIs e Serviços** > **Credenciais**
2. Clique em **+ CRIAR CREDENCIAIS** > **ID do cliente OAuth**
3. Configure a tela de consentimento OAuth:
   - Tipo: **Externo**
   - Nome do app: **BelleBook**
   - Email de suporte: Seu email
   - Domínios autorizados: `localhost` (para desenvolvimento)
   - Escopos: 
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`

4. Crie o ID do cliente OAuth:
   - Tipo: **Aplicativo Web**
   - Nome: **BelleBook Web**
   - URIs de redirecionamento autorizados:
     ```
     http://localhost:3000/api/google-calendar/callback
     ```

5. **SALVE AS CREDENCIAIS**:
   - **Client ID**: `xxx.apps.googleusercontent.com`
   - **Client Secret**: `xxx`

### 4️⃣ **Configurar Variáveis de Ambiente**

No arquivo `.env` do backend (`bellebook-backend/.env`):

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar/callback

# Frontend
FRONTEND_URL=http://localhost:3001

# Prestador de Serviço (sua esposa)
PROVIDER_USER_ID=id_da_sua_esposa_no_banco
PROVIDER_EMAIL=email_da_sua_esposa@gmail.com
PROVIDER_NAME=Nome da Sua Esposa
BUSINESS_ADDRESS=Endereço do Salão
```

### 5️⃣ **Configurar Usuário Prestador**

1. **Criar conta para o prestador**:
   ```bash
   # Use a aplicação para registrar sua esposa como usuária
   # Anote o ID do usuário criado
   ```

2. **Atualizar role para PROVIDER**:
   ```sql
   UPDATE users SET role = 'PROVIDER' WHERE email = 'email_da_sua_esposa@gmail.com';
   ```

3. **Adicionar o ID ao .env**:
   ```env
   PROVIDER_USER_ID=id_obtido_aqui
   ```

---

## 🔄 Como Funciona a Integração

### **Fluxo de Autorização**

1. **Cliente** faz login no BelleBook
2. Ao agendar, pode conectar sua conta Google (opcional)
3. **Prestador** conecta sua conta Google nas configurações
4. Ambos autorizam o BelleBook a gerenciar seus calendários

### **Criação de Eventos**

Quando um agendamento é criado:

1. ✅ Evento criado no Google Calendar do **cliente** (se conectado)
2. ✅ Evento criado no Google Calendar do **prestador** (se conectado)
3. ✅ Convites enviados automaticamente entre as partes
4. ✅ Lembretes configurados (24h e 1h antes)

### **Dados Sincronizados**

```javascript
// Evento no Calendar do Cliente
{
  título: "Manicure - BelleBook",
  descrição: "Serviço: Manicure\nCategoria: Unhas\nValor: R$ 45,00",
  local: "Endereço do Salão",
  participante: "prestador@email.com"
}

// Evento no Calendar do Prestador
{
  título: "Manicure - Maria Silva",
  descrição: "Cliente: Maria Silva\nTelefone: (11) 98765-4321\nServiço: Manicure",
  local: "Endereço do Salão",
  participante: "cliente@email.com"
}
```

---

## 🎯 Funcionalidades Implementadas

### ✅ **Backend**

- `GoogleCalendarModule` completo
- `GoogleCalendarService` com métodos:
  - `generateAuthUrl()` - URL de autenticação OAuth
  - `saveTokens()` - Salvar tokens de acesso
  - `createBookingEvents()` - Criar em ambas as agendas
  - `updateCalendarEvent()` - Atualizar eventos
  - `cancelBookingEvents()` - Cancelar em ambas as agendas
  - `getProviderBusySlots()` - Verificar disponibilidade

### ✅ **Integração com Bookings**

- Criação automática ao agendar
- Atualização ao reagendar
- Cancelamento sincronizado
- Verificação de disponibilidade do prestador

### ✅ **Segurança**

- Tokens OAuth criptografados no banco
- Refresh automático de tokens expirados
- Permissões granulares por usuário
- Falhas não críticas (não quebra agendamento)

---

## 🧪 Como Testar

### 1. **Conectar Conta do Prestador**

```bash
# 1. Fazer login como prestador
# 2. Acessar: http://localhost:3001/settings
# 3. Clicar em "Conectar Google Calendar"
# 4. Autorizar acesso
```

### 2. **Fazer Agendamento como Cliente**

```bash
# 1. Login como cliente
# 2. Escolher serviço
# 3. Agendar data/hora
# 4. Confirmar
```

### 3. **Verificar Calendários**

- ✅ Abrir Google Calendar do **cliente**
- ✅ Abrir Google Calendar do **prestador**
- ✅ Verificar eventos criados em ambos
- ✅ Verificar convites enviados

---

## 🛠️ Troubleshooting

### **Erro: "Cliente não autenticado com Google Calendar"**
- Normal se o cliente não conectou sua conta
- O sistema continua funcionando sem Google Calendar

### **Erro: "Prestador não autenticado"**
- Verificar se `PROVIDER_USER_ID` está correto no `.env`
- Confirmar que o prestador autorizou o OAuth

### **Tokens Expirados**
- O sistema renova automaticamente
- Se falhar, reconectar a conta nas configurações

### **Eventos Duplicados**
- Verificar se não há múltiplas instâncias rodando
- Limpar eventos manualmente se necessário

---

## 📊 Status da Implementação

| Funcionalidade | Status |
|---------------|---------|
| OAuth 2.0 | ✅ Completo |
| Criar Eventos Duplos | ✅ Completo |
| Atualizar Eventos | ✅ Completo |
| Cancelar Eventos | ✅ Completo |
| Verificar Disponibilidade | ✅ Completo |
| Notificações Automáticas | ✅ Completo |
| Refresh Token | ✅ Completo |
| Interface de Configuração | ⏳ Pendente |

---

## 🚀 Próximos Passos

1. **Interface de Configuração**: Criar página `/settings` no frontend
2. **Dashboard de Agenda**: Visualizar agenda integrada
3. **Sincronização Reversa**: Importar eventos do Google Calendar
4. **Multi-Prestadores**: Suportar múltiplos prestadores
5. **Webhook**: Receber atualizações em tempo real do Google

---

## 📝 Notas Importantes

⚠️ **Desenvolvimento**: Use `localhost` para testes
⚠️ **Produção**: Atualizar URIs de redirecionamento
⚠️ **Limites**: Google Calendar API tem quota de 1.000.000 requests/dia
⚠️ **LGPD**: Informar usuários sobre uso de dados do Google

---

**Desenvolvido com ❤️ para otimizar o agendamento do salão de beleza**
