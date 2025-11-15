# 📡 API Endpoints - BelleBook

Base URL: `http://localhost:3001/api`

## 🔐 Autenticação

### POST /auth/register
Criar nova conta de usuário

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "phone": "11999999999" // opcional
}
```

**Resposta 201:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cuid123",
    "email": "usuario@email.com",
    "name": "Nome do Usuário",
    "points": 0
  }
}
```

---

### POST /auth/login
Fazer login

**Body:**
```json
{
  "email": "cliente@bellebook.com",
  "password": "senha123"
}
```

**Resposta 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cuid123",
    "email": "cliente@bellebook.com",
    "name": "Maria Cliente",
    "points": 150
  }
}
```

**Erros:**
- 401: Credenciais inválidas
- 409: Email já está em uso (register)

---

## 🎯 Serviços

### GET /services/categories
Listar todas as categorias

**Resposta 200:**
```json
[
  {
    "id": "cat1",
    "name": "Sobrancelha",
    "description": "Design, micropigmentação e tratamentos",
    "icon": "Eye",
    "order": 0,
    "isActive": true
  },
  {
    "id": "cat2",
    "name": "Unha",
    "description": "Manicure, pedicure e nail art",
    "icon": "Palette",
    "order": 1,
    "isActive": true
  }
]
```

---

### GET /services/category/:categoryId
Listar serviços de uma categoria

**Query Parameters:**
- `sort`: `price-asc` | `price-desc` | `name-asc` | `name-desc`
- `minPrice`: número (ex: 50)
- `maxPrice`: número (ex: 200)
- `search`: string de busca

**Exemplo:**
```
GET /services/category/cat1?sort=price-asc&minPrice=30&maxPrice=100
```

**Resposta 200:**
```json
[
  {
    "id": "serv1",
    "name": "Design de Sobrancelha",
    "description": "Design personalizado com pinça",
    "duration": 45,
    "price": 65.00,
    "promoPrice": 52.00,
    "images": ["/placeholder.jpg"],
    "categoryId": "cat1",
    "category": {
      "name": "Sobrancelha"
    }
  }
]
```

---

### GET /services/search?q=:query
Buscar serviços por nome ou descrição

**Exemplo:**
```
GET /services/search?q=unha
```

---

### GET /services/:id
Detalhes de um serviço específico

**Resposta 200:**
```json
{
  "id": "serv1",
  "name": "Design de Sobrancelha",
  "description": "Design personalizado com pinça e tesoura",
  "duration": 45,
  "price": 65.00,
  "promoPrice": 52.00,
  "images": ["/placeholder.jpg"],
  "categoryId": "cat1",
  "category": {
    "id": "cat1",
    "name": "Sobrancelha",
    "icon": "Eye"
  },
  "reviews": [
    {
      "id": "rev1",
      "rating": 5,
      "comment": "Adorei!",
      "user": {
        "name": "Cliente VIP"
      }
    }
  ]
}
```

---

## 📅 Agendamentos

> **⚠️ Todos os endpoints de agendamento requerem autenticação (Bearer token)**

### GET /bookings/slots
Verificar horários disponíveis

**Query Parameters:**
- `serviceId`: ID do serviço (obrigatório)
- `date`: Data no formato YYYY-MM-DD (obrigatório)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Exemplo:**
```
GET /bookings/slots?serviceId=serv1&date=2024-11-20
```

**Resposta 200:**
```json
{
  "availableSlots": [
    "09:00", "09:30", "10:00", "10:30",
    "14:00", "14:30", "15:00", "15:30"
  ]
}
```

---

### POST /bookings
Criar novo agendamento

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "serviceId": "serv1",
  "date": "2024-11-20T14:00:00",
  "time": "14:00",
  "paymentMethod": "pay_now",
  "notes": "Primeira visita"
}
```

**Resposta 201:**
```json
{
  "id": "book1",
  "userId": "user1",
  "serviceId": "serv1",
  "date": "2024-11-20T14:00:00",
  "time": "14:00",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "totalPaid": 52.00,
  "service": {
    "name": "Design de Sobrancelha",
    "duration": 45
  }
}
```

---

### GET /bookings/my
Listar meus agendamentos

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta 200:**
```json
[
  {
    "id": "book1",
    "date": "2024-11-20T14:00:00",
    "time": "14:00",
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "totalPaid": 52.00,
    "service": {
      "name": "Design de Sobrancelha",
      "duration": 45,
      "category": {
        "name": "Sobrancelha"
      }
    }
  }
]
```

---

### GET /bookings/next
Obter próximo agendamento

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta 200:**
```json
{
  "id": "book1",
  "date": "2024-11-20T14:00:00",
  "time": "14:00",
  "status": "CONFIRMED",
  "service": {
    "name": "Design de Sobrancelha"
  }
}
```

**Resposta 204:** Nenhum agendamento futuro

---

### DELETE /bookings/:id
Cancelar agendamento

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta 200:**
```json
{
  "message": "Agendamento cancelado com sucesso"
}
```

**Erros:**
- 404: Agendamento não encontrado
- 403: Você não tem permissão para cancelar este agendamento

---

### PUT /bookings/:id/reschedule
Reagendar

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "date": "2024-11-22",
  "time": "15:00"
}
```

**Resposta 200:**
```json
{
  "id": "book1",
  "date": "2024-11-22T15:00:00",
  "time": "15:00",
  "status": "CONFIRMED",
  "service": {
    "name": "Design de Sobrancelha"
  }
}
```

---

## 🚧 Endpoints Planejados (Não Implementados)

### Carrinho
- POST `/cart/add` - Adicionar ao carrinho
- GET `/cart` - Ver carrinho
- DELETE `/cart/:itemId` - Remover do carrinho
- DELETE `/cart` - Limpar carrinho

### Favoritos
- POST `/favorites/:serviceId` - Adicionar aos favoritos
- DELETE `/favorites/:serviceId` - Remover dos favoritos
- GET `/favorites` - Listar favoritos

### Pagamentos (Stripe)
- POST `/payments/create-intent` - Criar intenção de pagamento
- POST `/payments/confirm` - Confirmar pagamento
- POST `/payments/webhook` - Webhook do Stripe

### Google Calendar
- POST `/calendar/sync` - Sincronizar com Google Calendar
- GET `/calendar/events` - Listar eventos

### Notificações
- GET `/notifications` - Listar notificações
- PUT `/notifications/:id/read` - Marcar como lida
- POST `/notifications/send` - Enviar notificação (admin)

### Reviews
- POST `/reviews` - Criar avaliação
- GET `/services/:id/reviews` - Reviews de um serviço
- PUT `/reviews/:id` - Atualizar review
- DELETE `/reviews/:id` - Deletar review

### Admin
- GET `/admin/stats` - Estatísticas do sistema
- GET `/admin/users` - Listar usuários
- GET `/admin/bookings` - Listar todos agendamentos
- PUT `/admin/bookings/:id/status` - Atualizar status

### Analytics
- GET `/analytics/popular-services` - Serviços mais populares
- GET `/analytics/revenue` - Receita por período
- GET `/analytics/bookings-trend` - Tendência de agendamentos

---

## 🛠️ Status das Implementações

| Módulo | Status | Endpoints |
|--------|--------|-----------|
| **Autenticação** | ✅ Completo | 2/2 |
| **Serviços** | ✅ Completo | 4/4 |
| **Agendamentos** | ✅ Completo | 6/6 |
| **Carrinho** | 🚧 Planejado | 0/4 |
| **Favoritos** | 🚧 Planejado | 0/3 |
| **Pagamentos** | 🚧 Planejado | 0/3 |
| **Google Calendar** | 🚧 Planejado | 0/2 |
| **Notificações** | 🚧 Planejado | 0/3 |
| **Reviews** | 🚧 Planejado | 0/4 |
| **Admin** | 🚧 Planejado | 0/4 |
| **Analytics** | ✅ Parcial | 3/3 |

---

## 🔑 Autenticação JWT

Após fazer login, inclua o token em todas as requisições protegidas:

```
Authorization: Bearer {access_token}
```

**Token expira em:** 7 dias

**Refresh:** Não implementado ainda (fazer login novamente)

---

## ❌ Tratamento de Erros

Todos os endpoints retornam erros no formato:

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro",
  "error": "Bad Request"
}
```

### Códigos de Status Comuns

- **200 OK**: Sucesso
- **201 Created**: Recurso criado
- **204 No Content**: Sucesso sem conteúdo
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autenticado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: email já existe)
- **500 Internal Server Error**: Erro no servidor

---

## 🧪 Testando a API

### Com cURL:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@bellebook.com","password":"senha123"}'

# Listar categorias
curl http://localhost:3001/api/services/categories

# Criar agendamento (com token)
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "serviceId":"serv1",
    "date":"2024-11-20T14:00:00",
    "time":"14:00"
  }'
```

### Com Postman/Insomnia:

1. Importar collection (criar arquivo JSON com endpoints)
2. Configurar variável de ambiente `{{baseUrl}}` = `http://localhost:3001/api`
3. Após login, salvar `access_token` em variável
4. Usar `Bearer {{access_token}}` nos headers

---

**Última atualização:** Novembro 2024
