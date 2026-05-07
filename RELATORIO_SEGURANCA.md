# TikTok Stock Sync - Relatório de Segurança

## CONTAS ADMINISTRATIVAS VINCULADAS

### 1. Conta GitHub
- **Proprietário**: barbosagomes
- **Repositório**: https://github.com/barbosagomes/gb-ss
- **Permissões**: Push, Pull, Admin
- **OAuth App**: ID 3581173
- **Risco**: Credenciais do GitHub armazenadas em variáveis de ambiente do Railway

### 2. Conta Google Cloud
- **Projeto**: TikTok Stock Sync
- **Email Associado**: (não especificado no projeto)
- **Permissões**: Criar/gerenciar OAuth credentials
- **Risco**: Credenciais do Google armazenadas em variáveis de ambiente do Railway

### 3. Conta Manus (Fallback)
- **App ID**: tiktok-stock-sync-app
- **Tipo**: OAuth Manus
- **Risco**: Baixo (usando serviço gerenciado)

### 4. Conta Railway
- **Projeto**: zestful-creativity
- **Serviço**: gb-ss
- **Permissões**: Deploy, variáveis de ambiente, logs
- **Risco**: Credenciais de terceiros armazenadas em variáveis

## APIS VINCULADAS

| API | Status | Credenciais | Local Armazenado |
|-----|--------|-------------|------------------|
| GitHub OAuth | ✅ Ativo | Client ID + Secret | Railway ENV |
| Google OAuth | ✅ Ativo | Client ID + Secret | Railway ENV |
| TikTok Shop | ❌ Não configurado | - | - |
| Manus Forge | ✅ Ativo | API Key | Railway ENV |
| MySQL/TiDB | ✅ Ativo | Connection String | Railway ENV |

## RISCOS DE SEGURANÇA IDENTIFICADOS

### 🔴 CRÍTICO
1. **Credenciais em Variáveis de Ambiente Públicas**
   - GitHub Client Secret armazenado em texto plano no Railway
   - Google Client Secret armazenado em texto plano no Railway
   - Qualquer pessoa com acesso ao Railway pode ver as credenciais

2. **Sem Rotação de Chaves**
   - Não há sistema de rotação automática de credenciais
   - Se uma chave for comprometida, requer ação manual

### 🟡 ALTO
3. **Sem Rate Limiting nos Callbacks OAuth**
   - Endpoints `/api/oauth/github/callback` e `/api/oauth/google/callback` não têm proteção contra brute force

4. **Sem Validação de State Parameter**
   - State parameter é apenas base64 encoded, não assinado
   - Vulnerável a CSRF attacks

5. **Logs de Debug em Produção**
   - Arquivo oauth.ts tem console.log com informações sensíveis
   - Pode expor credenciais em logs do Railway

## PASSO A PASSO: MIGRAR PARA SUAS CONTAS

### FASE 1: Preparação (Sem Downtime)

#### 1.1 GitHub OAuth - Criar Nova Aplicação
```bash
# 1. Acesse https://github.com/settings/applications/new
# 2. Preencha:
#    - Application name: TikTok Stock Sync (Pessoal)
#    - Homepage URL: https://seu-dominio.com
#    - Authorization callback URL: https://seu-dominio.com/api/oauth/github/callback
# 3. Clique "Register application"
# 4. Copie o novo Client ID e gere um novo Client Secret
# 5. Salve em local seguro (não compartilhe)
```

#### 1.2 Google OAuth - Criar Nova Aplicação
```bash
# 1. Acesse https://console.cloud.google.com/
# 2. Crie um novo projeto: "TikTok Stock Sync (Pessoal)"
# 3. Vá para APIs & Services > Credentials
# 4. Clique "Create Credentials" > "OAuth 2.0 Client ID"
# 5. Selecione "Web application"
# 6. Configure:
#    - Name: TikTok Stock Sync Web
#    - Authorized redirect URIs: https://seu-dominio.com/api/oauth/google/callback
# 7. Clique "Create"
# 8. Copie Client ID e Client Secret
# 9. Salve em local seguro
```

#### 1.3 TikTok Shop API - Registrar Aplicação
```bash
# 1. Acesse https://seller.tiktok.com/
# 2. Vá para Settings > Apps & Integrations
# 3. Clique "Create app"
# 4. Preencha informações da aplicação
# 5. Configure Redirect URL: https://seu-dominio.com/api/oauth/tiktok/callback
# 6. Copie App Key, App Secret, App ID
# 7. Salve em local seguro
```

### FASE 2: Atualizar Railway (Sem Downtime)

#### 2.1 Adicionar Novas Variáveis
```bash
# No Railway, adicione as novas variáveis:
GITHUB_CLIENT_ID_NEW=seu_novo_github_id
GITHUB_CLIENT_SECRET_NEW=seu_novo_github_secret
GOOGLE_CLIENT_ID_NEW=seu_novo_google_id
GOOGLE_CLIENT_SECRET_NEW=seu_novo_google_secret
TIKTOK_APP_KEY=seu_tiktok_app_key
TIKTOK_APP_SECRET=seu_tiktok_app_secret
TIKTOK_APP_ID=seu_tiktok_app_id
TIKTOK_REDIRECT_URL=https://seu-dominio.com/api/oauth/tiktok/callback
```

#### 2.2 Atualizar Código para Usar Novas Variáveis
```typescript
// server/_core/env.ts
export const ENV = {
  githubClientId: process.env.GITHUB_CLIENT_ID_NEW || process.env.GITHUB_CLIENT_ID || "",
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET_NEW || process.env.GITHUB_CLIENT_SECRET || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID_NEW || process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET_NEW || process.env.GOOGLE_CLIENT_SECRET || "",
  tiktokAppKey: process.env.TIKTOK_APP_KEY || "",
  tiktokAppSecret: process.env.TIKTOK_APP_SECRET || "",
  tiktokAppId: process.env.TIKTOK_APP_ID || "",
  tiktokRedirectUrl: process.env.TIKTOK_REDIRECT_URL || "",
};
```

#### 2.3 Fazer Deploy
```bash
cd /tmp/gb-ss-local
git add server/_core/env.ts
git commit -m "feat: Support new OAuth credentials"
git push origin main
# Railway fará deploy automático
```

### FASE 3: Validação e Cutover

#### 3.1 Testar Novas Credenciais
```bash
# 1. Acesse https://seu-dominio.com/login
# 2. Clique "Continuar com GitHub"
# 3. Autorize a aplicação
# 4. Verifique se o login funciona
# 5. Repita para Google OAuth
```

#### 3.2 Remover Credenciais Antigas
```bash
# Após confirmar que novas credenciais funcionam:
# 1. No Railway, remova as variáveis antigas:
#    - GITHUB_CLIENT_ID (antiga)
#    - GITHUB_CLIENT_SECRET (antiga)
#    - GOOGLE_CLIENT_ID (antiga)
#    - GOOGLE_CLIENT_SECRET (antiga)
# 2. Renomeie as novas variáveis:
#    - GITHUB_CLIENT_ID_NEW → GITHUB_CLIENT_ID
#    - GITHUB_CLIENT_SECRET_NEW → GITHUB_CLIENT_SECRET
#    - GOOGLE_CLIENT_ID_NEW → GOOGLE_CLIENT_ID
#    - GOOGLE_CLIENT_SECRET_NEW → GOOGLE_CLIENT_SECRET
# 3. Atualize env.ts para usar nomes originais
# 4. Faça deploy final
```

#### 3.3 Desativar Aplicações Antigas
```bash
# 1. GitHub: Delete a aplicação antiga em https://github.com/settings/applications/3581173
# 2. Google Cloud: Delete o projeto antigo
# 3. Confirme que nenhum serviço usa as credenciais antigas
```

## CHECKLIST DE SEGURANÇA PÓS-MIGRAÇÃO

- [ ] Todas as credenciais antigas removidas do Railway
- [ ] Novas credenciais testadas e funcionando
- [ ] Aplicações OAuth antigas deletadas
- [ ] Logs de debug removidos do código (console.log)
- [ ] Rate limiting implementado nos endpoints OAuth
- [ ] State parameter assinado com HMAC
- [ ] Rotação de credenciais documentada
- [ ] Backup de credenciais em local seguro (1Password, Vault, etc)
- [ ] Acesso ao Railway restrito a pessoas autorizadas
- [ ] Auditoria de logs do Railway habilitada

## RECOMENDAÇÕES DE SEGURANÇA

1. **Use um gerenciador de secrets** (1Password, Vault, AWS Secrets Manager)
2. **Implemente rotação automática de credenciais** a cada 90 dias
3. **Remova console.log em produção** - use logger estruturado
4. **Implemente rate limiting** nos endpoints OAuth
5. **Assine o state parameter** com HMAC para prevenir CSRF
6. **Use HTTPS everywhere** - já configurado no Railway
7. **Implemente audit logging** de todas as autenticações
8. **Monitore tentativas de login falhadas** - possível ataque
9. **Implemente 2FA** para contas administrativas
10. **Revise permissões do Railway** regularmente

## CONTATO E SUPORTE

Para questões de segurança, entre em contato com a equipe de desenvolvimento.
Não compartilhe credenciais por email ou chat não-criptografado.
