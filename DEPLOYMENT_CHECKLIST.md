# ✅ Checklist de Deployment - TikTok Stock Sync

## 🎯 Objetivo
Publicar sua aplicação TikTok Stock Sync em produção com domínio gbstocksync.sbs

---

## 📋 Fase 1: Preparação (5 minutos)

### GitHub
- [ ] Criar repositório no GitHub (https://github.com/new)
- [ ] Fazer push do código:
  ```bash
  git init
  git add .
  git commit -m "Projeto TikTok Stock Sync"
  git branch -M main
  git remote add origin https://github.com/seu-usuario/tiktok-stock-sync.git
  git push -u origin main
  ```
- [ ] Verificar se todos os arquivos estão no repositório

### Credenciais Manus
- [ ] Obter `VITE_APP_ID` (do Manus)
- [ ] Obter `BUILT_IN_FORGE_API_KEY` (do Manus)
- [ ] Obter `VITE_FRONTEND_FORGE_API_KEY` (do Manus)
- [ ] Gerar `JWT_SECRET` único:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## 🚀 Fase 2: Deploy em Railway (10 minutos)

### Criar Conta Railway
- [ ] Acessar https://railway.app
- [ ] Clicar em "Sign Up"
- [ ] Escolher "GitHub"
- [ ] Autorizar conexão

### Criar Projeto
- [ ] Clicar em "New Project"
- [ ] Escolher "Deploy from GitHub repo"
- [ ] Selecionar `tiktok-stock-sync`
- [ ] Clicar em "Deploy"
- [ ] Aguardar build (2-5 minutos)

### Configurar Variáveis de Ambiente
- [ ] Ir para **Variables**
- [ ] Adicionar todas as variáveis (veja abaixo)
- [ ] Salvar

**Variáveis a adicionar:**
```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu-valor-gerado
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Guilherme Gomes
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
NODE_ENV=production
PORT=3000
```

### Criar Banco de Dados
- [ ] Clicar em "+ Add"
- [ ] Escolher "MySQL"
- [ ] Clicar em "Add"
- [ ] Copiar `DATABASE_URL` gerada
- [ ] Adicionar em **Variables** como `DATABASE_URL`

### Executar Migrations
- [ ] No Railway, abrir **Shell**
- [ ] Executar:
  ```bash
  npm run db:push
  ```
- [ ] Aguardar conclusão

---

## 🌐 Fase 3: Configurar Domínio (5 minutos)

### Obter URL Railway
- [ ] No Railway, clicar em **Deployments**
- [ ] Copiar URL pública (ex: `seu-projeto-production.railway.app`)

### Configurar Railway
- [ ] No Railway, ir para **Settings**
- [ ] Clicar em **Domains**
- [ ] Clicar em "Add Domain"
- [ ] Digitar: `gbstocksync.sbs`
- [ ] Clicar em "Add"
- [ ] Copiar os registros DNS gerados

### Configurar Hostinger
- [ ] Acessar https://hpanel.hostinger.com/
- [ ] Ir para **Domínios > Meus domínios**
- [ ] Clicar em **gbstocksync.sbs**
- [ ] Ir para **DNS**
- [ ] Adicionar registros CNAME do Railway
- [ ] Salvar
- [ ] Aguardar propagação (5-30 minutos)

---

## ✅ Fase 4: Validação (5 minutos)

### Testar Aplicação
- [ ] Acessar https://gbstocksync.sbs
- [ ] Página carrega sem erros
- [ ] Certificado SSL está ativo (🔒)
- [ ] Fazer login funciona
- [ ] Sidebar aparece
- [ ] Navegação funciona

### Testar Funcionalidades
- [ ] Home page: Saudação dinâmica aparece
- [ ] Produtos: Listagem carrega
- [ ] Analytics: Gráficos aparecem
- [ ] Configurações: Formulário funciona
- [ ] Logout: Funciona corretamente

### Verificar Performance
- [ ] Aplicação carrega em menos de 3 segundos
- [ ] Não há erros no console (F12)
- [ ] Banco de dados responde

---

## 🔧 Fase 5: Monitoramento (Contínuo)

### Verificar Logs
- [ ] No Railway, clicar em **Logs**
- [ ] Verificar se há erros
- [ ] Verificar se aplicação está rodando

### Verificar Métricas
- [ ] No Railway, clicar em **Metrics**
- [ ] CPU: Deve estar abaixo de 80%
- [ ] Memória: Deve estar abaixo de 80%
- [ ] Requisições: Devem estar respondendo

### Configurar Alertas
- [ ] No Railway, ir para **Settings**
- [ ] Configurar alertas para:
  - [ ] Build falha
  - [ ] Aplicação cai
  - [ ] Erro de banco de dados

---

## 🎉 Conclusão

Quando todos os itens estiverem marcados ✅, sua aplicação estará:
- ✅ Publicada em produção
- ✅ Acessível via gbstocksync.sbs
- ✅ Com SSL configurado
- ✅ Com banco de dados funcionando
- ✅ Pronta para uso

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Build falha | Verifique `Dockerfile` e `package.json` |
| Domínio não funciona | Aguarde 24-48h para propagação DNS |
| Banco não conecta | Verifique `DATABASE_URL` |
| Aplicação cai | Verifique logs no Railway |
| Erro de memória | Aumente plano Railway |

---

## 🚀 Próximos Passos

Após deploy bem-sucedido:
1. Compartilhar link com usuários
2. Monitorar performance
3. Coletar feedback
4. Planejar melhorias
5. Configurar backups

---

**Boa sorte! 🎊**
