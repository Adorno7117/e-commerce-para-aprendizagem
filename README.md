# DigitalHub - E-commerce para produtos digitais

Projeto full-stack para venda de cursos, ebooks, templates, sistemas, artes digitais e outros produtos baixaveis. O fluxo nao possui frete nem endereco de entrega: o arquivo digital fica em storage privado e so e liberado depois que o pagamento e aprovado no servidor.

## Stack escolhida

- **Next.js 15 + TypeScript**: frontend, server components e API no mesmo projeto, com boa performance e organizacao.
- **Prisma ORM + MySQL**: schema relacional, migrations e compatibilidade com MySQL Workbench.
- **JWT em cookie httpOnly**: sessao segura, `sameSite`, `secure` em producao e protecao contra leitura por JavaScript.
- **bcryptjs**: hash seguro de senhas.
- **Zod**: validacao no backend.
- **Stripe preparado + gateway mock**: webhooks validados e fluxo local simples para testes.
- **Storage privado local**: arquivos fora de `/public`, entregues por token temporario.

## Funcionalidades

- Pagina inicial, catalogo, detalhes do produto, carrinho, checkout e compra como visitante.
- Cadastro, login, logout, recuperacao de senha e vinculacao automatica de pedidos de visitante ao criar conta com o mesmo email.
- Area do cliente com historico e downloads comprados.
- Admin protegido com dashboard, produtos, categorias, pedidos, usuarios e upload privado de arquivos digitais.
- Carrinho persistente para usuario logado e temporario para visitante.
- Cupom de exemplo `BEMVINDO10`.
- Downloads com token temporario, expiracao e limite de uso.
- Webhook mock assinado e webhook Stripe preparado.
- Rate limit em login, cadastro, recuperacao e checkout.
- Headers de seguranca, CSP, validacao de origem para mutacoes e ORM contra SQL Injection.

## Requisitos

- Node.js 20+
- MySQL 8+
- MySQL Workbench opcional

## Instalacao

```bash
npm install
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/digital_commerce"
SESSION_SECRET="uma-chave-real-com-32-ou-mais-caracteres"
PAYMENT_WEBHOOK_SECRET="outro-segredo-real-para-webhooks"
PAYMENT_PROVIDER="mock"
MOCK_AUTO_APPROVE="true"
```

## Configurar MySQL

Crie o banco pelo MySQL Workbench executando:

```sql
CREATE DATABASE digital_commerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Depois rode as migrations:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

O arquivo [database/init.sql](database/init.sql) tambem contem um SQL de referencia compativel com MySQL Workbench.

## Usuario admin

O seed cria o admin usando as variaveis do `.env`:

```env
ADMIN_EMAIL="admin@demo.com"
ADMIN_PASSWORD="Admin@123456"
```

Acesse `/login` com esses dados e depois `/admin`.

## Rodar o projeto

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Testar uma compra

1. Entre em `/produtos`.
2. Adicione um produto ao carrinho.
3. Acesse `/checkout`.
4. Informe nome, email e opcionalmente o cupom `BEMVINDO10`.
5. Com `PAYMENT_PROVIDER=mock` e `MOCK_AUTO_APPROVE=true`, o servidor aprova o pedido localmente e redireciona para a pagina de sucesso.
6. Clique em **Baixar**. O sistema gera um link temporario em `/api/downloads/[token]`.

Em producao, use um gateway real e mantenha `MOCK_AUTO_APPROVE=false` ou `PAYMENT_PROVIDER=stripe`.

## Configurar Stripe

No `.env`:

```env
PAYMENT_PROVIDER="stripe"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
APP_URL="https://seu-dominio.com"
```

Configure no painel da Stripe o endpoint:

```text
https://seu-dominio.com/api/webhooks/stripe
```

Evento esperado:

```text
checkout.session.completed
```

O pedido so e marcado como pago em `handleStripeWebhook`, apos validacao da assinatura enviada pela Stripe.

## Webhook mock assinado

Para homologar sem auto-aprovacao, envie um POST para `/api/webhooks/mock` com corpo:

```json
{"publicId":"PED-EXEMPLO","paymentId":"mock_123"}
```

O header `x-mock-signature` deve ser o HMAC SHA-256 do corpo usando `PAYMENT_WEBHOOK_SECRET`.

## Estrutura

```text
src/app                 Rotas, paginas e API handlers
src/components          Componentes de UI e interacao
src/lib                 Prisma, auth, validacao, seguranca e helpers
src/server/services     Regras de negocio
prisma/schema.prisma    Modelo relacional MySQL
prisma/seed.ts          Admin, categorias, produtos e cupom iniciais
database/init.sql       SQL de referencia para Workbench
storage/private         Arquivos digitais privados
```

## Observacoes de seguranca

- Nao armazene dados de cartao no banco.
- Use HTTPS em producao.
- Troque todos os secrets do `.env`.
- Mantenha arquivos digitais fora de `/public`.
- Use webhooks assinados do gateway para liberar pedidos.
- Logs de pagamento armazenam apenas dados seguros e resumidos.
- Em producao, considere storage privado como S3 com URLs assinadas e antivírus no upload.
