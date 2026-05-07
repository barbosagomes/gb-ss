# 🚀 Guia de Deployment - TikTok Stock Sync em Railway

## ✅ Pré-requisitos

- [ ] Conta GitHub (para conectar repositório)
- [ ] Conta Railway (criar em railway.app)
- [ ] Domínio gbstocksync.sbs (já tem na Hostinger)
- [ ] Banco de dados MySQL (será criado no Railway)

---

## 📋 Passo 1: Preparar o Repositório GitHub

### 1.1 Criar repositório no GitHub
```bash
# Se ainda não tiver um repositório
git init
git add .
git commit -m "Projeto TikTok Stock Sync pronto para deploy"
git branch -M main
git remote add origin https://github.com/seu-usuario/tiktok-stock-sync.git
git push -u origin main
```

### 1.2 Arquivos de Deploy Já Criados
Os seguintes arquivos já foram criados para você:
- ✅ `Dockerfile` - Configuração Docker
- ✅ `.dockerignore` - Arquivos a ignorar
- ✅ `railway.json` - Configuração Railway

---

## 🚀 Passo 2: Deploy em Railway

### 2.1 Criar Conta Railway
1. Acesse https://railway.app
2. Clique em "Sign Up"
3. Escolha "GitHub" para login
4. Autorize a conexão

### 2.2 Criar Novo Projeto
1. Clique em "New Project"
2. Escolha "Deploy from GitHub repo"
3. Selecione seu repositório `tiktok-stock-sync`
4. Clique em "Deploy"

### 2.3 Configurar Variáveis de Ambiente
No Railway, vá para **Variables** e adicione:

```env
# Database (será criado automaticamente)
DATABASE_URL=mysql://user:password@host:port/database

# Auth
JWT_SECRET=seu-secret-super-seguro-aqui-123456
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Guilherme Gomes

# API
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-manus
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend-manus
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Node
NODE_ENV=production
PORT=3000
```

### 2.4 Criar Banco de Dados MySQL
1. No Railway, clique em "+ Add"
2. Escolha "MySQL"
3. Clique em "Add"
4. O banco será criado automaticamente
5. Copie a URL de conexão para `DATABASE_URL`

---

## 🌐 Passo 3: Apontar Domínio Hostinger

### 3.1 Obter URL do Railway
1. No Railway, vá para seu projeto
2. Clique em "Deployments"
3. Copie a URL pública (ex: `seu-projeto-production.railway.app`)

### 3.2 Configurar DNS na Hostinger
1. Acesse https://hpanel.hostinger.com/
2. Vá para **Domínios > Meus domínios**
3. Clique em **gbstocksync.sbs**
4. Vá para **DNS**
5. Adicione um registro CNAME:
   - **Nome**: `www`
   - **Tipo**: CNAME
   - **Valor**: `seu-projeto-production.railway.app`
6. Clique em "Salvar"

### 3.3 Configurar no Railway
1. No Railway, vá para **Settings**
2. Clique em **Domains**
3. Clique em "Add Domain"
4. Digite: `gbstocksync.sbs`
5. Clique em "Add"
6. Railway gerará um certificado SSL automaticamente

---

## ✅ Passo 4: Validar Deploy

### 4.1 Testar Aplicação
1. Acesse https://gbstocksync.sbs
2. Você deve ver a página de login
3. Faça login com suas credenciais

### 4.2 Verificar Logs
No Railway:
1. Clique em "Deployments"
2. Clique no deployment ativo
3. Veja os logs para verificar se tudo está funcionando

### 4.3 Testar Funcionalidades
- [ ] Home page carrega
- [ ] Login funciona
- [ ] Sidebar aparece
- [ ] Navegação entre páginas funciona
- [ ] Dados carregam do banco

---

## 🔧 Troubleshooting

### Erro: "Build failed"
**Solução:**
1. Verifique se `package.json` está correto
2. Verifique se `Dockerfile` está correto
3. Veja os logs no Railway para mais detalhes

### Erro: "Database connection failed"
**Solução:**
1. Verifique se `DATABASE_URL` está correto
2. Verifique se o banco MySQL foi criado
3. Execute as migrations no Railway

### Erro: "Cannot find module"
**Solução:**
1. Verifique se `npm install` foi executado
2. Verifique se todas as dependências estão em `package.json`

### Domínio não funciona
**Solução:**
1. Aguarde 24-48 horas para propagação DNS
2. Verifique se CNAME foi adicionado corretamente
3. Verifique se domínio foi adicionado no Railway

---

## 📊 Monitoramento

### Verificar Status
1. No Railway, vá para **Deployments**
2. Veja o status do deployment (verde = funcionando)

### Ver Logs
1. Clique em "Logs"
2. Veja os logs da aplicação em tempo real

### Métricas
1. Clique em "Metrics"
2. Veja CPU, memória e requisições

---

## 🔐 Segurança

### Variáveis Sensíveis
- ✅ Nunca commite `.env` no Git
- ✅ Sempre use variáveis de ambiente no Railway
- ✅ Mude `JWT_SECRET` para um valor único

### Certificado SSL
- ✅ Railway fornece SSL gratuitamente
- ✅ Certificado é renovado automaticamente
- ✅ Seu domínio estará protegido (🔒)

---

## 🚀 Próximos Passos

### Curto Prazo
1. [ ] Fazer deploy em Railway
2. [ ] Testar todas as funcionalidades
3. [ ] Configurar domínio
4. [ ] Validar SSL

### Médio Prazo
1. [ ] Configurar backups do banco
2. [ ] Configurar monitoramento
3. [ ] Configurar alertas
4. [ ] Documentar processo

### Longo Prazo
1. [ ] Implementar CI/CD
2. [ ] Adicionar testes automatizados
3. [ ] Configurar staging environment
4. [ ] Planejar escalabilidade

---

## 📞 Suporte

### Railway Docs
- https://docs.railway.app/

### Hostinger Docs
- https://www.hostinger.com/help

### Comunidade
- Discord Railway: https://discord.gg/railway
- GitHub Issues: https://github.com/seu-usuario/tiktok-stock-sync/issues

---

## ✨ Conclusão

Seu projeto **TikTok Stock Sync** está pronto para ser publicado em produção! 🎉

Siga os passos acima e sua aplicação estará no ar em poucos minutos!

**Bom deployment!** 🚀
