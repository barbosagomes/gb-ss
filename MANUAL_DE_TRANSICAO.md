# Manual de Transição — TikTok Stock Sync (gb-ss)

**Repositório:** https://github.com/barbosagomes/gb-ss  
**Deploy:** https://gb-ss-production.up.railway.app  
**Railway Project ID:** `317042cc-73d8-4b33-a9d6-2301d71a8be0`  
**Service ID (gb-ss):** `78a7e1ef-7e9f-4894-860e-6a8dd0b0fa2c`

---

## 1. Arquitetura do Projeto

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| Frontend | Vite + React 19 + Tailwind CSS 4 | SPA com roteamento via Wouter |
| Backend | Express 4 + tRPC 11 | API RPC tipada end-to-end |
| ORM | Drizzle ORM (MySQL dialect) | Schema-first, migrations SQL |
| Banco | MySQL 8 (Railway) | Persistência de dados |
| Auth | OAuth custom (GitHub + Google + TikTok) | Sessão via JWT em cookie |
| Build | esbuild (server) + Vite (client) | Bundle para produção |
| Deploy | Docker (Dockerfile) no Railway | Auto-deploy via GitHub webhook |

**Fluxo de comunicação:**

```
Browser → Vite SPA → tRPC hooks (client/src/lib/trpc.ts)
                          ↓
              HTTP POST /api/trpc/*
                          ↓
Express (server/_core/index.ts) → tRPC router (server/routers.ts)
                          ↓
              Drizzle ORM → MySQL (Railway)
```

O Express serve o frontend estático (dist do Vite) e expõe:
- `/api/trpc/*` — procedimentos tRPC
- `/api/oauth/github/callback` — OAuth GitHub
- `/api/oauth/google/callback` — OAuth Google
- `/api/oauth/tiktok/callback` — OAuth TikTok Shop
- `/api/oauth/callback` — OAuth Manus (legado)

---

## 2. Estado do Banco de Dados

### Schema (drizzle/schema.ts)

| Tabela | Função |
|--------|--------|
| `users` | Usuários autenticados (openId, name, email, role, loginMethod) |
| `access_tokens` | Tokens OAuth do TikTok Shop por usuário |
| `tiktok_configs` | Configuração da loja TikTok (appKey, appSecret, redirectUrl) |
| `products` | Produtos sincronizados do TikTok Shop |
| `skus` | SKUs de cada produto (estoque, preço) |
| `sync_logs` | Log de sincronizações de estoque |
| `sync_errors` | Erros de sincronização para retry |
| `product_costs` | Custos detalhados por SKU |
| `financial_metrics` | Métricas financeiras diárias |
| `sku_pricing` | Preço de venda e margem por SKU |

### Migrations existentes

```
drizzle/0000_fearless_paladin.sql  → CREATE TABLE users
drizzle/0001_mixed_synch.sql       → CREATE TABLE access_tokens, tiktok_configs, products, skus, sync_logs, sync_errors
drizzle/0002_young_ego.sql         → CREATE TABLE financial_metrics, product_costs, sku_pricing
```

### STATUS: TABELAS NÃO CRIADAS

As migrations **ainda não foram executadas** no MySQL do Railway. O banco está vazio.

**Para criar as tabelas, execute:**

```bash
# Opção 1: Via drizzle-kit (precisa de acesso externo ao MySQL)
DATABASE_URL="mysql://root:dRdUwIkTZLudTBVIeuftBlFFGNDyeJfN@<HOST_PUBLICO>:<PORTA_PUBLICA>/railway" pnpm drizzle-kit migrate

# Opção 2: Copiar o SQL manualmente
# Concatene os 3 arquivos .sql e execute no console MySQL do Railway:
cat drizzle/0000_fearless_paladin.sql drizzle/0001_mixed_synch.sql drizzle/0002_young_ego.sql
```

**Para obter o host público do MySQL:**
1. Acesse Railway → projeto → MySQL → Settings → Networking
2. Ative "Public Networking" se não estiver ativo
3. Use o host e porta TCP proxy fornecidos

---

## 3. Pendência do OAuth (O Gargalo)

### Problema

O login via GitHub/Google **redireciona corretamente** para o provedor OAuth e retorna com o `code`. O handler em `server/_core/oauth.ts` (linha 14: `handleGitHubCallback`) recebe o código e troca pelo token com sucesso.

**O erro ocorre na linha 81 de `oauth.ts`:**

```typescript
const sessionToken = await sdk.createSessionToken(openId, { ... });
```

Que chama `sdk.signSession()` → `this.getSessionSecret()` → `new TextEncoder().encode(ENV.cookieSecret)`

**Causa raiz:** `ENV.cookieSecret` (= `process.env.JWT_SECRET`) está **vazio** no Railway. A biblioteca `jose` rejeita chaves de comprimento zero com o erro:

```
Error: Zero-length key is not supported
```

### Solução

Adicionar `JWT_SECRET` com um valor real no Railway:

```
JWT_SECRET=tiktok-stock-sync-secret-key-2024-production
```

### Registro de rotas (ESTÁ CORRETO)

O arquivo `server/_core/index.ts` já importa e chama `registerOAuthRoutes(app)` na linha 39. As rotas `/api/oauth/github/callback`, `/api/oauth/google/callback` e `/api/oauth/tiktok/callback` **estão registradas** em `oauth.ts` linhas 221-223. O problema **não é 404 de rota**, é crash interno por JWT_SECRET vazio.

---

## 4. Integração TikTok

### Chaves configuradas

| Variável | Valor | Status no Railway |
|----------|-------|-------------------|
| `TIKTOK_APP_KEY` | `6jspb65e6m9ov` | Configurada |
| `TIKTOK_APP_SECRET` | `6151679f3dee318f7aa6b3ffc6cc812c5cf0fb84` | Configurada |
| `TIKTOK_REDIRECT_URL` | `https://gb-ss-production.up.railway.app/api/oauth/tiktok/callback` | Configurada |

### Arquivo `server/tiktok-api.ts`

Todas as funções chamam **endpoints reais** da API TikTok Shop v2:

| Método | Endpoint | Status |
|--------|----------|--------|
| `exchangeCodeForToken()` | `POST /v1/oauth/token` | Real |
| `refreshToken()` | `POST /v1/oauth/token` | Real |
| `getProducts()` | `GET /product/202309/products` | Real |
| `getSkus()` | `GET /product/202309/products/{id}/skus` | Real |
| `updateInventory()` | `POST /product/202309/products/{id}/inventory/update` | Real |
| `verifyWebhookSignature()` | N/A (local) | Real |

**Base URL:** `https://open-api.tiktokglobalshop.com` (produção)

**Não há mock data** no `tiktok-api.ts`. O arquivo `server/routers.ts` usa `createTiktokClient()` com as chaves do ENV para todas as operações.

### Fluxo de conexão TikTok

1. Usuário logado acessa `/settings`
2. Clica "Conectar TikTok Shop"
3. Frontend chama `trpc.tiktok.getAuthUrl.useQuery()` que gera URL do TikTok Seller Center
4. Usuário autoriza no TikTok
5. Callback em `/api/oauth/tiktok/callback` troca code por token
6. Token salvo em tabela `access_tokens`
7. Dashboard chama `trpc.tiktok.getProducts.useQuery()` para listar produtos

---

## 5. Variáveis de Ambiente (Mapa Completo)

### Variáveis que DEVEM estar no Railway (serviço gb-ss)

| Variável | Valor/Referência | Obrigatória |
|----------|-----------------|-------------|
| `DATABASE_URL` | `mysql://root:<pwd>@mysql.railway.internal:3306/railway` | SIM |
| `JWT_SECRET` | `tiktok-stock-sync-secret-key-2024-production` | SIM |
| `GITHUB_CLIENT_ID` | `Ov23li2gjbSYAvEN6Iua` | SIM |
| `GITHUB_CLIENT_SECRET` | `4909b6c2671af0b4299e0c6d994ec586cb0c44f0` | SIM |
| `GOOGLE_CLIENT_ID` | `38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com` | SIM |
| `GOOGLE_CLIENT_SECRET` | `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` | SIM |
| `TIKTOK_APP_KEY` | `6jspb65e6m9ov` | SIM |
| `TIKTOK_APP_SECRET` | `6151679f3dee318f7aa6b3ffc6cc812c5cf0fb84` | SIM |
| `TIKTOK_REDIRECT_URL` | `https://gb-ss-production.up.railway.app/api/oauth/tiktok/callback` | SIM |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | Opcional (legado) |
| `NODE_ENV` | `production` | SIM |
| `BUILT_IN_FORGE_API_KEY` | (valor do Manus) | Opcional |

### Variáveis automáticas do Railway (já existem)

O Railway injeta automaticamente 8 variáveis internas (RAILWAY_ENVIRONMENT, etc.)

### Como adicionar DATABASE_URL ao serviço gb-ss

No Railway, o MySQL está como serviço separado. Para conectar:

1. Railway Dashboard → gb-ss → Variables → New Variable
2. Nome: `DATABASE_URL`
3. Valor: `${{MySQL.MYSQL_URL}}` (referência ao serviço MySQL interno)

Ou manualmente: `mysql://root:dRdUwIkTZLudTBVIeuftBlFFGNDyeJfN@mysql.railway.internal:3306/railway`

---

## 6. Guia de Execução Local

### Pré-requisitos

- Node.js 20+
- pnpm 10+
- MySQL 8 local ou acesso ao MySQL do Railway (porta pública)

### Instalação

```bash
git clone https://github.com/barbosagomes/gb-ss.git
cd gb-ss
pnpm install
```

### Configurar variáveis locais

```bash
cat > .env << 'EOF'
DATABASE_URL=mysql://root:password@localhost:3306/tiktok_stock_sync
JWT_SECRET=dev-secret-key-local
GITHUB_CLIENT_ID=Ov23li2gjbSYAvEN6Iua
GITHUB_CLIENT_SECRET=4909b6c2671af0b4299e0c6d994ec586cb0c44f0
GOOGLE_CLIENT_ID=38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
TIKTOK_APP_KEY=6jspb65e6m9ov
TIKTOK_APP_SECRET=6151679f3dee318f7aa6b3ffc6cc812c5cf0fb84
TIKTOK_REDIRECT_URL=http://localhost:3000/api/oauth/tiktok/callback
NODE_ENV=development
EOF
```

### Criar banco e tabelas

```bash
# Criar banco MySQL local
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tiktok_stock_sync;"

# Gerar e aplicar migrations
DATABASE_URL="mysql://root:password@localhost:3306/tiktok_stock_sync" pnpm db:push
```

### Iniciar em modo dev

```bash
pnpm dev
# Acesse http://localhost:3000
```

### Build de produção

```bash
pnpm build
pnpm start
```

---

## 7. Checklist para Assumir o Projeto

- [ ] Clonar repositório: `git clone https://github.com/barbosagomes/gb-ss.git`
- [ ] Adicionar `DATABASE_URL` no Railway (referência `${{MySQL.MYSQL_URL}}` ou valor direto)
- [ ] Garantir `JWT_SECRET` no Railway (qualquer string >= 32 chars)
- [ ] Ativar networking público no MySQL Railway para rodar migrations externamente
- [ ] Executar migrations: `DATABASE_URL="mysql://..." pnpm db:push`
- [ ] Redeploy no Railway (push vazio ou trigger manual)
- [ ] Testar login GitHub em https://gb-ss-production.up.railway.app/login
- [ ] Conectar TikTok Shop via Settings
- [ ] Verificar produtos no Dashboard

---

## 8. Arquivos-Chave

```
server/_core/index.ts      → Express bootstrap, registra rotas OAuth (linha 39)
server/_core/oauth.ts      → Handlers GitHub/Google/TikTok callback
server/_core/sdk.ts        → JWT session (usa ENV.cookieSecret = JWT_SECRET)
server/_core/env.ts        → Mapa de variáveis de ambiente
server/routers.ts          → Procedimentos tRPC (auth, tiktok, system)
server/tiktok-api.ts       → Cliente HTTP TikTok Shop API (endpoints reais)
server/db.ts               → Helpers de banco (upsertUser, getUserByOpenId)
server/db-tiktok.ts        → Helpers TikTok (tokens, products, skus)
drizzle/schema.ts          → Schema completo do banco
client/src/const.ts        → URLs de login OAuth (GitHub, Google)
client/src/pages/Login.tsx  → Página de login com botões OAuth
client/src/pages/Home.tsx   → Dashboard principal
client/src/App.tsx          → Rotas do frontend
Dockerfile                 → Build Docker para Railway
start.sh                   → Script de inicialização
```
