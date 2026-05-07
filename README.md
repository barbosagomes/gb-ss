# TikTok Stock Sync - Integração e Sincronização de Estoque

Uma aplicação elegante e completa para sincronizar estoque entre sua loja e o TikTok Shop, com análise financeira avançada e controle centralizado via painel.

## 🎯 Funcionalidades Principais

### 1. **Integração OAuth com TikTok Shop**
- Fluxo de autorização seguro
- Armazenamento automático de tokens
- Renovação automática de access_token
- Suporte para ambiente Sandbox e Produção

### 2. **Sincronização Bidirecional de Estoque**
- Sincronização automática via webhooks
- Atualização manual via API
- Registro detalhado de todas as alterações
- Suporte para múltiplos SKUs por produto

### 3. **Análise Financeira Avançada**
- Cálculo de custo total por SKU (produto + etiqueta + embalagem + plástico bolha + outros)
- Cálculo automático de margem de lucro
- Dashboard com gráficos de tendência
- Estimativa de lucro diário
- Identificação de produtos mais e menos lucrativos
- Alertas para margens baixas

### 4. **Painel de Controle Elegante**
- Dashboard com visão geral
- Gerenciamento de produtos e SKUs
- Configurações de integração
- Histórico de sincronização
- Sistema de alertas e notificações
- Análise financeira com gráficos

### 5. **Webhooks HTTPS**
- Verificação de assinatura HMAC-SHA256
- Suporte para eventos:
  - Inventory Changed (#68)
  - Order Status Change (#1)
- Processamento automático de eventos
- Registro de erros e retry automático

## 🚀 Quick Start

### Pré-requisitos
- Node.js 22+
- MySQL/TiDB
- Conta TikTok Shop Partner

### Instalação

```bash
# Clonar repositório
git clone <seu-repositorio>
cd tiktok-stock-sync

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar migrações do banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Configuração Inicial

1. **Acessar a aplicação**
   - URL: http://localhost:3000
   - Fazer login com sua conta Manus

2. **Configurar credenciais do TikTok Shop**
   - Ir para Settings (/settings)
   - Inserir App Key, App Secret e Redirect URL
   - Selecionar ambiente (Sandbox ou Produção)

3. **Autorizar integração**
   - Clicar em "Autorizar com TikTok Shop"
   - Conceder permissões necessárias
   - Tokens serão armazenados automaticamente

4. **Sincronizar produtos**
   - Ir para Products (/products)
   - Clicar em "Sincronizar Produtos"
   - Aguardar sincronização completa

5. **Configurar custos**
   - Em Products, clicar no ícone de edição para cada SKU
   - Inserir custos (produto, etiqueta, embalagem, etc.)
   - Salvar configuração

## 📊 Estrutura do Projeto

```
tiktok-stock-sync/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                   # Páginas principais
│   │   │   ├── Home.tsx             # Dashboard
│   │   │   ├── Settings.tsx         # Configurações
│   │   │   ├── Products.tsx         # Produtos e SKUs
│   │   │   ├── Analytics.tsx        # Análise financeira
│   │   │   ├── SyncLogs.tsx         # Histórico de sincronização
│   │   │   └── Alerts.tsx           # Alertas e notificações
│   │   ├── components/              # Componentes reutilizáveis
│   │   ├── hooks/                   # Hooks customizados
│   │   ├── lib/                     # Utilitários
│   │   └── App.tsx                  # Roteamento
│   └── index.html
├── server/                          # Backend Node.js/Express
│   ├── _core/                       # Framework core
│   │   ├── index.ts                 # Servidor Express
│   │   ├── context.ts               # Contexto tRPC
│   │   ├── env.ts                   # Variáveis de ambiente
│   │   └── oauth.ts                 # Fluxo OAuth
│   ├── routers.ts                   # Procedimentos tRPC
│   ├── routers-financial.ts         # Procedimentos financeiros
│   ├── db.ts                        # Helpers de banco
│   ├── db-tiktok.ts                 # Helpers TikTok Shop
│   ├── db-financial.ts              # Helpers financeiros
│   ├── tiktok-api.ts                # Cliente TikTok Shop API
│   ├── webhooks.ts                  # Handlers de webhooks
│   └── webhook-handler.ts           # Lógica de webhooks
├── drizzle/                         # Schema do banco de dados
│   ├── schema.ts                    # Definição das tabelas
│   └── migrations/                  # Migrações SQL
├── shared/                          # Código compartilhado
│   ├── types.ts                     # Tipos TypeScript
│   └── constants.ts                 # Constantes
└── package.json
```

## 🗄️ Banco de Dados

### Tabelas Principais

**users**
- Usuários autenticados
- Informações de perfil
- Roles (user, admin)

**tiktok_apps**
- Configurações de aplicativo
- App Key, App Secret
- Redirect URL
- Ambiente (Sandbox/Produção)

**access_tokens**
- Tokens OAuth do TikTok Shop
- Refresh tokens
- Data de expiração

**products**
- Produtos sincronizados
- ID do TikTok Shop
- Nome, descrição
- Status de sincronização

**skus**
- SKUs dos produtos
- Quantidade em estoque
- Preço de venda
- Status

**product_costs**
- Custo do produto
- Custo de etiqueta
- Custo de embalagem
- Custo de plástico bolha
- Outros custos

**sku_pricing**
- Preço de venda
- Margem de lucro (% e valor)
- Última atualização

**financial_metrics**
- Métricas diárias
- Custo total do dia
- Receita estimada
- Lucro estimado
- Margem média

**sync_logs**
- Registro de sincronizações
- Origem (webhook, manual, API)
- Delta de quantidade
- Timestamp

**sync_errors**
- Erros de sincronização
- Mensagem de erro
- SKU afetado
- Retry automático

## 🔌 Webhooks

### Configuração no TikTok Shop

1. Acesse https://partner.tiktokshop.com/
2. Vá para seu aplicativo
3. Configure os webhooks:

**Inventory Changed (#68)**
```
URL: https://seu-dominio/api/webhooks/tiktok/inventory-changed
Eventos: Inventory Changed
```

**Order Status Change (#1)**
```
URL: https://seu-dominio/api/webhooks/tiktok/order-status-change
Eventos: Order Status Change
```

### Verificação de Assinatura

Todos os webhooks são verificados com HMAC-SHA256:

```
Signature = HMAC-SHA256(
  key=APP_SECRET,
  message="{timestamp}.{nonce}.{body}"
)
```

## 📱 API Endpoints

### Autenticação
- `POST /api/oauth/callback` - Callback OAuth
- `POST /api/trpc/auth.logout` - Logout

### Produtos
- `POST /api/trpc/tiktok.syncProducts` - Sincronizar produtos
- `GET /api/trpc/tiktok.listProducts` - Listar produtos
- `GET /api/trpc/tiktok.listSkus` - Listar SKUs

### Estoque
- `POST /api/trpc/tiktok.updateInventory` - Atualizar estoque
- `GET /api/trpc/tiktok.getInventory` - Obter estoque

### Financeiro
- `POST /api/trpc/financial.updateCosts` - Atualizar custos
- `GET /api/trpc/financial.getMetrics` - Obter métricas
- `GET /api/trpc/financial.getSkuPricing` - Obter preços

### Webhooks
- `POST /api/webhooks/tiktok/inventory-changed` - Webhook de estoque
- `POST /api/webhooks/tiktok/order-status-change` - Webhook de pedido
- `GET /api/webhooks/tiktok/health` - Health check

## 🧪 Testes

### Executar testes
```bash
pnpm test
```

### Testes inclusos
- ✅ Validação de credenciais TikTok Shop
- ✅ Logout de autenticação
- ✅ Verificação de assinatura HMAC-SHA256

## 📖 Documentação Adicional

- [Guia de Testes](./GUIA_TESTES.md)
- [Instruções de Migração SQL](./APPLY_MIGRATION.md)
- [Prompt de Setup do TikTok Shop](./PROMPT_TIKTOK_SHOP_SETUP.md)

## 🌍 Localização

A aplicação está totalmente localizada para **Português Brasileiro**:
- ✅ Datas em formato DD/MM/YYYY
- ✅ Moeda em BRL (R$)
- ✅ Separadores decimais em vírgula (,)
- ✅ Separadores de milhares em ponto (.)
- ✅ Todos os textos em português

## 🎨 Design

- **Tema:** OKLCH (moderno e acessível)
- **Componentes:** shadcn/ui + Tailwind CSS 4
- **Responsividade:** Mobile-first
- **Gráficos:** Recharts
- **Ícones:** Lucide React

## 🔒 Segurança

- ✅ OAuth 2.0 com TikTok Shop
- ✅ HMAC-SHA256 para webhooks
- ✅ Tokens armazenados com segurança
- ✅ Variáveis de ambiente protegidas
- ✅ Validação de entrada em todos os endpoints
- ✅ Proteção CSRF
- ✅ Rate limiting

## 🚀 Deploy

### Opção 1: Manus Hosting (Recomendado)
- Clique em "Publish" no painel de controle
- Configure seu domínio customizado
- Deploy automático

### Opção 2: Hostinger
- Exporte o código via GitHub
- Configure Node.js na Hostinger
- Deploy manual

### Opção 3: Outro Provedor
- Build: `pnpm build`
- Start: `pnpm start`
- Variáveis de ambiente necessárias

## 🐛 Troubleshooting

### Problema: Credenciais não aparecem em Settings
**Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente.

### Problema: Webhooks não funcionam
**Solução:** Verifique se a URL está correta e se o servidor está acessível publicamente.

### Problema: Erro ao sincronizar produtos
**Solução:** Verifique se os tokens OAuth estão válidos e se as permissões foram concedidas.

### Problema: Gráficos não renderizam
**Solução:** Limpe o cache do navegador (Ctrl+Shift+Del) e recarregue.

## 📞 Suporte

Para suporte, verifique:
1. Console do navegador (F12)
2. Logs do servidor
3. Status do banco de dados
4. Variáveis de ambiente

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido por

Manus AI - Integração TikTok Shop Stock Sync

---

**Última atualização:** 06/05/2026
**Versão:** 1.0.0
