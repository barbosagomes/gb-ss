# TikTok Stock Sync - Status do Projeto

## O QUE FUNCIONA

- ✅ Página de login com design X UI profissional
- ✅ Autenticação OAuth com GitHub (fluxo implementado)
- ✅ Autenticação OAuth com Google (fluxo implementado)
- ✅ Dashboard com layout profissional
- ✅ Rota tRPC para listar produtos TikTok (mock data)
- ✅ Banco de dados MySQL/TiDB conectado
- ✅ Saudação dinâmica baseada em horário de Brasília
- ✅ Toggle de tema escuro/claro
- ✅ Sistema de autenticação de sessão com cookies
- ✅ Estrutura tRPC end-to-end com tipos TypeScript

## O QUE ESTÁ QUEBRADO

- ❌ GitHub OAuth callback retorna erro 404 (rota não registrada no Express)
- ❌ Google OAuth callback não testado
- ❌ Integração real com API do TikTok Shop não implementada (usando mock data)
- ❌ Sincronização de estoque não funcional
- ❌ Página de dashboard não carrega dados reais do TikTok

## VARIÁVEIS DE AMBIENTE CONFIGURADAS NO RAILWAY

### Configuradas e Ativas:
```
GITHUB_CLIENT_ID=Ov23li2gjbSYAvEN6Iua
GITHUB_CLIENT_SECRET=4909b6c2671af0b4299e0c6d994ec586cb0c44f0
GOOGLE_CLIENT_ID=38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
BUILT_IN_FORGE_API_KEY=sk-pZS51T4QnNMeklP3pkfG_fS5HujvSriJyGovFgxk0tzq5qz--xmKox7mD2slweDBnv_yDjMiX7q-jIq0Fn-Ztf0LHm5CA
VITE_OAUTH_PORTAL_URL=https://api.manus.im
OWNER_NAME=Guilherm...
OWNER_OPEN_ID=...
VITE_APP_ID=tiktok-stock-sync-app
JWT_SECRET=...
DATABASE_URL=mysql://...
```

### Não Configuradas (Necessárias):
```
TIKTOK_APP_KEY=
TIKTOK_APP_SECRET=
TIKTOK_APP_ID=
TIKTOK_REDIRECT_URL=
OAUTH_SERVER_URL=
```

## MAPA DE ARQUIVOS

```
gb-ss/
├── client/
│   ├── src/
│   │   ├── App.tsx                          # Rotas principais
│   │   ├── pages/
│   │   │   ├── Login.tsx                    # Página de login com GitHub/Google
│   │   │   ├── Home.tsx                     # Dashboard principal
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx          # Layout do dashboard
│   │   │   ├── Map.tsx                      # Integração Google Maps
│   │   │   └── ui/                          # Componentes shadcn/ui
│   │   ├── lib/
│   │   │   ├── trpc.ts                      # Cliente tRPC
│   │   │   └── greeting.ts                  # Função de saudação dinâmica
│   │   └── const.ts                         # URLs de login OAuth
│   └── index.html
├── server/
│   ├── _core/
│   │   ├── index.ts                         # Servidor Express principal
│   │   ├── oauth.ts                         # Handlers de GitHub/Google OAuth
│   │   ├── env.ts                           # Variáveis de ambiente
│   │   ├── trpc.ts                          # Configuração tRPC
│   │   └── ...
│   ├── routers.ts                           # Definição de rotas tRPC
│   ├── routers-financial.ts                 # Router financeiro
│   ├── db.ts                                # Funções de banco de dados
│   ├── db-tiktok.ts                         # Funções TikTok DB
│   ├── tiktok-api.ts                        # Cliente API TikTok
│   └── oauth.test.ts                        # Testes de OAuth
├── drizzle/
│   └── schema.ts                            # Schema do banco de dados
├── Dockerfile                               # Configuração Docker
├── package.json
└── start.sh                                 # Script de inicialização
```

## CONTAS E APIS VINCULADAS

### GitHub OAuth
- **Conta**: barbosagomes
- **App ID**: 3581173
- **Client ID**: Ov23li2gjbSYAvEN6Iua
- **Status**: Configurado, callback URL atualizado para `https://gb-ss-production.up.railway.app/api/oauth/github/callback`

### Google OAuth
- **Projeto**: TikTok Stock Sync
- **Client ID**: 38627040583-ug6omdfnro8mdbqagen7dab53vrh6b59.apps.googleusercontent.com
- **Status**: Configurado, aguardando teste

### TikTok Shop API
- **Status**: Não configurado
- **Necessário**: App Key, App Secret, App ID, Redirect URL

### Manus OAuth (Fallback)
- **App ID**: tiktok-stock-sync-app
- **Status**: Configurado como fallback

## COMO MIGRAR PARA SUAS CONTAS PESSOAIS

### 1. GitHub OAuth
```
1. Acesse: https://github.com/settings/applications/new
2. Crie uma nova aplicação OAuth
3. Configure Authorization callback URL: https://seu-dominio.com/api/oauth/github/callback
4. Copie o novo Client ID e Client Secret
5. No Railway, atualize as variáveis:
   - GITHUB_CLIENT_ID=seu_novo_id
   - GITHUB_CLIENT_SECRET=seu_novo_secret
6. Faça deploy
```

### 2. Google OAuth
```
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto
3. Vá para Credenciais > OAuth 2.0 Client ID
4. Configure Authorized redirect URIs: https://seu-dominio.com/api/oauth/google/callback
5. Copie o novo Client ID e Client Secret
6. No Railway, atualize as variáveis:
   - GOOGLE_CLIENT_ID=seu_novo_id
   - GOOGLE_CLIENT_SECRET=seu_novo_secret
7. Faça deploy
```

### 3. TikTok Shop API
```
1. Acesse: https://seller.tiktok.com/
2. Vá para Settings > Apps & Integrations
3. Crie uma nova aplicação
4. Configure Redirect URL: https://seu-dominio.com/api/oauth/tiktok/callback
5. Copie App Key, App Secret, App ID
6. No Railway, adicione as variáveis:
   - TIKTOK_APP_KEY=seu_app_key
   - TIKTOK_APP_SECRET=seu_app_secret
   - TIKTOK_APP_ID=seu_app_id
   - TIKTOK_REDIRECT_URL=https://seu-dominio.com/api/oauth/tiktok/callback
7. Faça deploy
```

### 4. Atualizar Domínio de Callback
Para cada provedor, atualize a URL de callback:
- **GitHub**: https://github.com/settings/applications/seu_app_id
- **Google**: https://console.cloud.google.com/apis/credentials
- **TikTok**: https://seller.tiktok.com/ > Apps & Integrations

## PRÓXIMOS PASSOS CRÍTICOS

1. **Corrigir GitHub OAuth Callback** - Registrar rota Express `/api/oauth/github/callback`
2. **Testar Google OAuth** - Implementar e testar fluxo completo
3. **Integrar API TikTok** - Conectar endpoints reais da API do TikTok Shop
4. **Implementar Sincronização** - Criar sistema de sincronização de estoque em tempo real
5. **Adicionar Autenticação TikTok** - Implementar OAuth com TikTok Shop

## INFORMAÇÕES DE DEPLOY

- **URL Atual**: https://gb-ss-production.up.railway.app
- **Plataforma**: Railway
- **Build**: Docker
- **Database**: MySQL/TiDB (Manus)
- **Status**: Online (com erros de OAuth)
