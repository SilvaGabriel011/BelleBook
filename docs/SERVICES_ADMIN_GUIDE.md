# 🎨 Gerenciamento de Serviços - BelleBook Admin

## 📝 Visão Geral

Sistema completo de **CRUD (Create, Read, Update, Delete)** para gerenciamento de serviços no painel administrativo do BelleBook. Permite aos administradores adicionar, editar, visualizar e remover serviços do catálogo.

---

## ✨ Funcionalidades Implementadas

### 📋 **Lista de Serviços**
- ✅ Visualização em tabela com todas as informações
- ✅ Imagem miniatura de cada serviço
- ✅ Nome, categoria, preço, duração e status
- ✅ Badges visuais para status (Ativo/Inativo)
- ✅ Destaque para preços promocionais

### 🔍 **Busca e Filtros**
- ✅ Busca por nome ou descrição
- ✅ Filtro por categoria
- ✅ Atualização em tempo real

### ➕ **Criar Serviço**
- ✅ Formulário completo com validação
- ✅ Campos: Nome, Descrição, Categoria, Preço, Preço Promocional, Duração
- ✅ Upload de múltiplas imagens (via URL)
- ✅ Preview das imagens
- ✅ Validação de campos obrigatórios
- ✅ Validação de preços (promocional < normal)

### ✏️ **Editar Serviço**
- ✅ Pré-preenchimento do formulário com dados existentes
- ✅ Edição de todos os campos
- ✅ Gerenciamento de imagens (adicionar/remover)
- ✅ Atualização em tempo real

### 🔄 **Ativar/Desativar Serviço**
- ✅ Toggle rápido de status sem deletar
- ✅ Serviços inativos não aparecem para usuários
- ✅ Mantém histórico de agendamentos

### 🗑️ **Excluir Serviço**
- ✅ Confirmação antes de excluir
- ✅ Proteção: não permite excluir serviços com agendamentos ativos
- ✅ Sugestão de desativar ao invés de deletar

---

## 🎯 Como Usar

### **Acessar o Gerenciamento**

1. Faça login como **ADMIN**
2. Acesse o Dashboard Admin: `/admin/dashboard`
3. Clique no botão **"Gerenciar Serviços"** nas Ações Rápidas
4. Ou acesse diretamente: `/admin/services`

### **Criar um Novo Serviço**

1. Clique no botão **"+ Novo Serviço"**
2. Preencha os campos:
   - **Nome**: Nome do serviço (ex: "Manicure Completa")
   - **Descrição**: Detalhes do serviço
   - **Categoria**: Selecione da lista (Unha, Sobrancelha, etc.)
   - **Preço**: Valor normal em R$
   - **Preço Promocional** (opcional): Valor com desconto
   - **Duração**: Tempo em minutos
3. Adicione imagens:
   - Cole a URL da imagem
   - Clique no ícone de upload ou pressione Enter
   - Repita para múltiplas imagens
4. Clique em **"Criar"**

### **Editar um Serviço**

1. Na tabela, clique no ícone de **lápis** (✏️)
2. Modifique os campos desejados
3. Adicione ou remova imagens
4. Clique em **"Atualizar"**

### **Ativar/Desativar Serviço**

1. Na tabela, clique no ícone de **olho** (👁️) ou **olho cortado** (🚫)
2. O status muda instantaneamente
3. Serviços inativos não aparecem para clientes

### **Excluir um Serviço**

1. Na tabela, clique no ícone de **lixeira** (🗑️)
2. Confirme a exclusão no diálogo
3. **Atenção**: Serviços com agendamentos ativos não podem ser excluídos

---

## 📡 Endpoints da API

### **Backend (NestJS)**

#### **Listar Todas as Categorias**
```http
GET /services/categories
```

#### **Listar Serviços por Categoria**
```http
GET /services/category/:categoryId
Query params: sort, minPrice, maxPrice, search
```

#### **Buscar Serviços**
```http
GET /services/search?q=termo
```

#### **Obter Serviço por ID**
```http
GET /services/:id
```

#### **Criar Serviço** 🔒 Admin
```http
POST /services
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  description: string,
  categoryId: string,
  price: number,
  promoPrice?: number,
  duration: number,
  images: string[],
  isActive?: boolean
}
```

#### **Atualizar Serviço** 🔒 Admin
```http
PUT /services/:id
Headers: Authorization: Bearer <token>
Body: (campos opcionais)
```

#### **Excluir Serviço** 🔒 Admin
```http
DELETE /services/:id
Headers: Authorization: Bearer <token>
```

#### **Ativar/Desativar Serviço** 🔒 Admin
```http
PUT /services/:id/toggle-active
Headers: Authorization: Bearer <token>
```

---

## 🔒 Segurança

### **Autenticação e Autorização**
- ✅ Todos os endpoints de escrita requerem autenticação JWT
- ✅ Guard `JwtAuthGuard` valida o token
- ✅ Guard `RolesGuard` verifica se o usuário é ADMIN
- ✅ Decorator `@Roles('ADMIN')` nas rotas protegidas

### **Validações**
- ✅ Categoria deve existir
- ✅ Preços devem ser positivos
- ✅ Duração deve ser positiva
- ✅ Preço promocional < Preço normal
- ✅ Proteção contra exclusão de serviços com agendamentos ativos

---

## 📂 Estrutura de Arquivos

### **Backend**
```
bellebook-backend/src/
├── services/
│   ├── services.controller.ts    # Rotas e endpoints
│   ├── services.service.ts       # Lógica de negócio
│   └── services.module.ts        # Módulo
├── auth/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts     # Guard de autenticação
│   │   └── roles.guard.ts        # Guard de permissões
│   └── decorators/
│       └── roles.decorator.ts    # Decorator de roles
```

### **Frontend**
```
bellebook-web/
├── app/(admin)/
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard com botão de acesso
│   └── services/
│       └── page.tsx              # Página de gerenciamento
├── components/
│   ├── admin/
│   │   └── ServiceFormDialog.tsx # Formulário criar/editar
│   └── ui/
│       ├── table.tsx             # Componente de tabela
│       └── dialog.tsx            # Componente de diálogo
└── services/
    └── services.service.ts       # Serviço de API
```

---

## 🎨 Interface do Usuário

### **Componentes Utilizados**
- **Shadcn/UI**: Biblioteca de componentes
- **Lucide React**: Ícones
- **Next.js Image**: Otimização de imagens
- **Sonner**: Notificações toast

### **Cores e Estilo**
- **Botão Principal**: Rosa (`bg-pink-500`)
- **Status Ativo**: Verde (`bg-green-500`)
- **Status Inativo**: Cinza (`bg-gray-400`)
- **Destaque de Preço Promocional**: Rosa (`text-pink-600`)

---

## 🔄 Fluxo de Dados

### **Criação de Serviço**
```mermaid
Frontend → POST /services → Backend → Valida dados
  → Verifica categoria → Cria no banco → Retorna serviço criado
  → Frontend atualiza lista → Mostra toast de sucesso
```

### **Edição de Serviço**
```mermaid
Frontend → PUT /services/:id → Backend → Verifica existência
  → Valida dados → Atualiza no banco → Retorna serviço atualizado
  → Frontend atualiza lista → Mostra toast de sucesso
```

### **Exclusão de Serviço**
```mermaid
Frontend → DELETE /services/:id → Backend → Verifica existência
  → Verifica agendamentos ativos → Se sim: Erro
  → Se não: Exclui do banco → Frontend atualiza lista
  → Mostra toast de sucesso
```

---

## 🚀 Próximos Passos

### **Melhorias Futuras**
- [ ] Upload de imagens para servidor próprio (Cloudinary)
- [ ] Drag & drop para reordenar imagens
- [ ] Duplicar serviço existente
- [ ] Importação/Exportação CSV
- [ ] Histórico de alterações
- [ ] Serviços em destaque
- [ ] Combos/Pacotes de serviços
- [ ] Agendamento de promoções

### **Integrações**
- [ ] WhatsApp: Notificar clientes sobre novos serviços
- [ ] Analytics: Rastrear serviços mais populares
- [ ] SEO: Páginas individuais de serviço

---

## 🐛 Tratamento de Erros

### **Erros Comuns**

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token inválido/expirado | Fazer login novamente |
| 403 Forbidden | Usuário não é ADMIN | Verificar role do usuário |
| 404 Not Found | Serviço/Categoria não existe | Verificar ID correto |
| 400 Bad Request | Dados inválidos | Revisar campos do formulário |
| 400 "Agendamentos ativos" | Tentativa de excluir serviço em uso | Desativar ao invés de excluir |

---

## 📋 Checklist de Validação

Antes de salvar um serviço, o sistema valida:

- [x] Nome não está vazio
- [x] Descrição não está vazia
- [x] Categoria foi selecionada
- [x] Preço é maior que zero
- [x] Duração é maior que zero
- [x] Preço promocional (se informado) é menor que o preço normal
- [x] Categoria existe no banco de dados

---

## 💡 Dicas de Uso

### **Upload de Imagens**
- Use URLs de serviços como Cloudinary, Imgur ou Google Drive
- Recomendado: Imagens de boa qualidade (mínimo 800x600px)
- Formato: JPG, PNG ou WebP
- Primeira imagem será a principal (capa)

### **Preços Promocionais**
- Deixe vazio se não houver promoção
- Use para destacar ofertas especiais
- Cliente verá o preço riscado e o promocional destacado

### **Duração**
- Sempre em minutos
- Inclua tempo de preparação e finalização
- Ex: Manicure = 60 minutos (prep + aplicação + secagem)

### **Descrição**
- Seja claro e objetivo
- Liste o que está incluído
- Mencione produtos/técnicas utilizadas
- Exemplo: "Manicure completa com esmaltação, cutilação e hidratação. Inclui esmalte de sua escolha."

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do backend (console)
2. Verifique as notificações toast no frontend
3. Confirme que o usuário tem role `ADMIN`
4. Verifique se o backend está rodando na porta 3000
5. Verifique se o frontend está rodando na porta 3001

---

**Sistema desenvolvido com 💜 para otimizar a gestão do catálogo de serviços do BelleBook!**

Com este sistema, o administrador tem controle total sobre os serviços oferecidos, podendo:
- ✅ Adicionar novos serviços rapidamente
- ✅ Atualizar preços e informações em tempo real
- ✅ Gerenciar promoções e ofertas especiais
- ✅ Controlar visibilidade de serviços
- ✅ Manter catálogo sempre atualizado

**Tudo pronto para escalar o negócio com um catálogo profissional e dinâmico!** 🚀
