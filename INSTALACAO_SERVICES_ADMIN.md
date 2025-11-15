# 🚀 Instalação - Gerenciamento de Serviços Admin

## Instalação das Dependências

O sistema de gerenciamento de serviços precisa de uma nova dependência no frontend.

### 1️⃣ Instalar Dependências do Frontend

```bash
cd bellebook-web
npm install
```

Isso instalará o `@radix-ui/react-dialog` que foi adicionado ao `package.json`.

## 2️⃣ Rodar as Migrações do Backend (se necessário)

O backend já usa o Prisma com SQLite. Se houver mudanças no schema:

```bash
cd bellebook-backend
npx prisma migrate dev --name add_services_crud
npx prisma generate
```

## 3️⃣ Iniciar os Servidores

### Backend (NestJS)
```bash
cd bellebook-backend
npm run start:dev
```
Rodará na porta **3000**

### Frontend (Next.js)
```bash
cd bellebook-web
npm run dev
```
Rodará na porta **3001**

## 4️⃣ Criar Usuário Admin

Para testar o sistema, você precisa de um usuário com role ADMIN.

### Opção A: Via Banco de Dados
```sql
-- SQLite
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'seu-email@exemplo.com';
```

### Opção B: Via Cadastro + Update Manual
1. Crie uma conta normalmente em `/signup`
2. Atualize o role no banco de dados usando o comando acima

## 5️⃣ Acessar o Sistema

1. Acesse: http://localhost:3001
2. Faça login com o usuário admin
3. Vá para: http://localhost:3001/admin/dashboard
4. Clique em "Gerenciar Serviços" ou acesse http://localhost:3001/admin/services

## ✅ Verificação

### Backend está funcionando?
```bash
curl http://localhost:3000/services/categories
```

Deve retornar as categorias em JSON.

### Frontend está funcionando?
Abra http://localhost:3001 no navegador. Deve carregar a página inicial.

### Autenticação está configurada?
Verifique se o JWT está sendo gerado corretamente ao fazer login.

## 🔧 Troubleshooting

### Erro: Cannot find module '@radix-ui/react-dialog'
**Solução**: Execute `npm install` no diretório `bellebook-web`

### Erro: 401 Unauthorized ao criar serviço
**Solução**: Verifique se o token JWT está sendo enviado e se o usuário tem role ADMIN

### Erro: 404 Not Found
**Solução**: Verifique se o backend está rodando na porta 3000

### Erro: ECONNREFUSED
**Solução**: Backend não está rodando. Inicie com `npm run start:dev`

## 📦 Arquivos Criados/Modificados

### Backend
- ✅ `bellebook-backend/src/services/services.controller.ts` - Atualizado com endpoints CRUD
- ✅ `bellebook-backend/src/services/services.service.ts` - Atualizado com métodos CRUD
- ✅ `bellebook-backend/src/auth/guards/roles.guard.ts` - Criado
- ✅ `bellebook-backend/src/auth/decorators/roles.decorator.ts` - Criado

### Frontend
- ✅ `bellebook-web/app/(admin)/services/page.tsx` - Criado
- ✅ `bellebook-web/components/admin/ServiceFormDialog.tsx` - Criado
- ✅ `bellebook-web/components/ui/table.tsx` - Criado
- ✅ `bellebook-web/components/ui/dialog.tsx` - Criado
- ✅ `bellebook-web/services/services.service.ts` - Atualizado com métodos admin
- ✅ `bellebook-web/package.json` - Atualizado com nova dependência

### Documentação
- ✅ `SERVICES_ADMIN_GUIDE.md` - Guia completo do sistema
- ✅ `INSTALACAO_SERVICES_ADMIN.md` - Este arquivo

## 🎉 Pronto!

Agora você pode gerenciar serviços através do painel administrativo!
