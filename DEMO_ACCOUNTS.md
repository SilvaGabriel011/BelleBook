# 🎭 Contas Demo - BelleBook

Este documento contém informações sobre as contas de demonstração disponíveis no BelleBook para testes e desenvolvimento.

## 📋 Índice
- [Contas Disponíveis](#contas-disponíveis)
- [Como Usar](#como-usar)
- [Dados de Exemplo](#dados-de-exemplo)

---

## 🔐 Contas Disponíveis

Todas as contas usam a mesma senha: **`senha123`**

### 👑 Administradora
- **Email:** `admin@bellebook.com`
- **Senha:** `senha123`
- **Role:** ADMIN
- **Descrição:** Acesso total ao sistema, pode gerenciar usuários, serviços, agendamentos e configurações.
- **Pontos:** 0

### 👤 Cliente
- **Email:** `cliente@bellebook.com`
- **Senha:** `senha123`
- **Role:** CLIENT
- **Descrição:** Cliente padrão com alguns agendamentos e histórico.
- **Pontos:** 150
- **Data de Nascimento:** 15/05/1995
- **Telefone:** (11) 99999-9992

**Histórico:**
- ✅ Design de Sobrancelha (20/11/2024 às 14:00) - CONFIRMADO
- ✅ Corte Feminino (05/11/2024 às 15:00) - COMPLETADO
- ⭐ Avaliou o Corte Feminino com 4 estrelas

### 💼 Funcionária
- **Email:** `funcionaria@bellebook.com`
- **Senha:** `senha123`
- **Role:** EMPLOYEE
- **Descrição:** Funcionária do salão, pode gerenciar agendamentos e atender clientes.
- **Pontos:** 50
- **Telefone:** (11) 99999-9993

### ⭐ Cliente VIP
- **Email:** `vip@bellebook.com`
- **Senha:** `senha123`
- **Role:** CLIENT
- **Descrição:** Cliente VIP com muitos pontos e histórico extenso.
- **Pontos:** 500
- **Data de Nascimento:** 20/10/1990
- **Telefone:** (11) 99999-9994

**Histórico:**
- ⏳ Alongamento em Gel (22/11/2024 às 16:00) - PENDENTE
- ✅ Manicure Tradicional (10/11/2024 às 10:00) - COMPLETADO
- ⭐ Avaliou a Manicure com 5 estrelas

---

## 🚀 Como Usar

### 1. Resetar o Banco de Dados (Opcional)

Se você quiser limpar todos os dados existentes antes de popular com os dados demo:

```bash
cd bellebook-backend

# Resetar migrations
npx prisma migrate reset --force

# Ou apenas rodar as migrations
npx prisma migrate dev
```

### 2. Popular com Dados Demo

```bash
cd bellebook-backend

# Executar seed
npm run seed
```

### 3. Login na Aplicação

Acesse a aplicação e faça login com uma das contas acima usando:
- Email de uma das contas
- Senha: `senha123`

---

## 📊 Dados de Exemplo Incluídos

### Categorias (4)
1. **Sobrancelha** - Design, micropigmentação e tratamentos
2. **Unha** - Manicure, pedicure, nail art e alongamento
3. **Cabelo** - Cortes, coloração, tratamentos e penteados
4. **Depilação** - Depilação a laser, cera e outros métodos

### Serviços (14)

#### Sobrancelha
- Design de Sobrancelha - R$ 65,00 (promo: R$ 52,00)
- Micropigmentação - R$ 350,00 (promo: R$ 280,00)
- Henna - R$ 35,00

#### Unha
- Manicure Tradicional - R$ 45,00 (promo: R$ 36,00)
- Pedicure Completa - R$ 55,00 (promo: R$ 44,00)
- Alongamento em Gel - R$ 120,00 (promo: R$ 96,00)
- Nail Art - R$ 25,00

#### Cabelo
- Corte Feminino - R$ 80,00 (promo: R$ 64,00)
- Coloração - R$ 180,00 (promo: R$ 144,00)
- Hidratação Profunda - R$ 95,00 (promo: R$ 76,00)
- Escova Progressiva - R$ 250,00

#### Depilação
- Depilação Axilas - R$ 30,00 (promo: R$ 24,00)
- Depilação Pernas Completas - R$ 75,00 (promo: R$ 60,00)
- Depilação Virilha Completa - R$ 65,00 (promo: R$ 52,00)
- Laser Axilas (Sessão) - R$ 90,00

### Agendamentos (4)
- 2 agendamentos futuros (1 confirmado, 1 pendente)
- 2 agendamentos completados (ambos com reviews)

### Reviews (2)
- Cliente VIP avaliou Manicure com 5 estrelas
- Cliente avaliou Corte Feminino com 4 estrelas

### Notificações (3)
- Lembrete de agendamento para Cliente
- Promoção especial para Cliente VIP
- Solicitação de review para Cliente (já lida)

### Favoritos
- Cliente favoritou: Design de Sobrancelha
- Cliente VIP favoritou: Design de Sobrancelha e Alongamento em Gel

---

## 🔄 Atualizando os Dados Demo

Se você precisar modificar os dados demo, edite o arquivo:

```
bellebook-backend/prisma/seed.ts
```

Depois execute novamente:

```bash
npm run seed
```

---

## 🧪 Casos de Teste

### Testar como Cliente
1. Login com `cliente@bellebook.com`
2. Ver próximo agendamento na home
3. Verificar notificações
4. Ver histórico de agendamentos
5. Adicionar serviços aos favoritos
6. Fazer novo agendamento

### Testar como Admin
1. Login com `admin@bellebook.com`
2. Ver todos os agendamentos
3. Gerenciar usuários
4. Gerenciar serviços e categorias
5. Ver estatísticas do sistema

### Testar como Funcionária
1. Login com `funcionaria@bellebook.com`
2. Ver agendamentos do dia
3. Marcar agendamentos como completados
4. Atender clientes

### Testar como Cliente VIP
1. Login com `vip@bellebook.com`
2. Ver pontos de fidelidade (500 pontos)
3. Ver histórico extenso
4. Receber promoções especiais

---

## 📝 Notas Importantes

- ⚠️ **Não use estas contas em produção!** Estas contas são apenas para desenvolvimento e testes.
- 🔒 A senha `senha123` é fraca e deve ser alterada para algo mais seguro em produção.
- 🗑️ Você pode resetar o banco de dados a qualquer momento usando `npx prisma migrate reset --force`.
- 📧 Os emails são fictícios e não receberão emails reais.
- 📞 Os números de telefone são fictícios.

---

## ❓ Problemas Comuns

### Erro ao executar seed
```bash
# Certifique-se de estar no diretório correto
cd bellebook-backend

# Verifique se as dependências estão instaladas
npm install

# Execute as migrations primeiro
npx prisma migrate dev
```

### Banco de dados não está limpo
```bash
# Resetar completamente o banco de dados
npx prisma migrate reset --force

# Depois execute o seed novamente
npm run seed
```

---

**Última atualização:** Novembro 2024
