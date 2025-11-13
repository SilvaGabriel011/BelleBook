# 🗄️ Configuração do Banco de Dados

## ⚠️ Docker Desktop não está rodando

Para usar PostgreSQL local, você tem **2 opções**:

---

## ✅ OPÇÃO 1: Docker Local (Recomendado para Dev)

### Passo 1: Iniciar Docker Desktop
- Abra o **Docker Desktop** no Windows
- Aguarde até estar completamente iniciado

### Passo 2: Criar Container PostgreSQL
```bash
docker run --name bellebook-db -e POSTGRES_PASSWORD=bellebook123 -e POSTGRES_DB=bellebook -p 5432:5432 -d postgres:15
```

### Passo 3: Verificar se está rodando
```bash
docker ps
```

Deve aparecer:
```
CONTAINER ID   IMAGE         PORTS                    NAMES
xxxxx          postgres:15   0.0.0.0:5432->5432/tcp   bellebook-db
```

### Comandos Úteis
```bash
# Parar o container
docker stop bellebook-db

# Iniciar o container novamente
docker start bellebook-db

# Ver logs
docker logs bellebook-db

# Remover container (cuidado! apaga os dados)
docker rm -f bellebook-db
```

---

## ✅ OPÇÃO 2: Supabase (RECOMENDADO - Grátis e Mais Simples!)

### Por que Supabase?
- ✅ Grátis para projetos pequenos
- ✅ Não precisa do Docker
- ✅ Funciona na nuvem
- ✅ Já vem com backup automático
- ✅ Interface web bonita
- ✅ Perfeito para produção

### Passo a Passo

#### 1. Criar Conta
- Acesse: https://supabase.com
- Clique em **"Start your project"**
- Faça login com GitHub

#### 2. Criar Projeto
- Clique em **"New Project"**
- Nome: `bellebook`
- Database Password: Escolha uma senha forte (anote!)
- Region: South America (São Paulo)
- Clique em **"Create new project"**
- Aguarde 1-2 minutos

#### 3. Pegar Connection String
- No dashboard do projeto, vá em **Settings** (engrenagem)
- Clique em **Database**
- Role até **Connection String**
- Escolha **URI**
- Copie a string (vai parecer com isso):
  ```
  postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
  ```

#### 4. Configurar no Projeto
Edite o arquivo `bellebook-backend/.env`:

```env
# Comente a linha do Docker:
# DATABASE_URL="postgresql://postgres:bellebook123@localhost:5432/bellebook?schema=public"

# Descomente e cole sua connection string:
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
```

**⚠️ IMPORTANTE:** Substitua `[PASSWORD]` pela senha que você criou!

---

## 🚀 Próximos Passos (Depois de Configurar)

### 1. Rodar Migrations do Prisma

```bash
cd d:\BelleBook\BelleBook\bellebook-backend
npx prisma migrate dev --name init
```

Isso vai:
- ✅ Criar todas as tabelas no banco
- ✅ Gerar o Prisma Client
- ✅ Validar o schema

### 2. Ver o Banco de Dados (Prisma Studio)

```bash
npx prisma studio
```

Abre uma interface web em `http://localhost:5555` para ver e editar os dados.

---

## ✨ Qual Opção Escolher?

### Use Docker se:
- Você já está familiarizado com Docker
- Quer ter controle total local
- Prefere desenvolver offline

### Use Supabase se:
- Quer algo rápido e simples
- Não quer lidar com Docker
- Quer um banco pronto para produção
- Quer interface web bonita

**Recomendação:** Use **Supabase** por ser mais simples e já vir pronto para deploy!

---

## 🆘 Problemas Comuns

### "Error: P1001: Can't reach database server"
- Docker: Verifique se o container está rodando com `docker ps`
- Supabase: Verifique se a connection string está correta no .env

### "Error: P1017: Server has closed the connection"
- Supabase: Troque `6543` por `5432` na connection string

### "Error: password authentication failed"
- Verifique a senha no .env
- Docker: deve ser `bellebook123`
- Supabase: a senha que você definiu ao criar o projeto

---

**Próximo:** Depois de configurar o banco, volte ao terminal e rode as migrations!
