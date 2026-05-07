# ⚡ Deploy Rápido - TikTok Stock Sync em Railway

## 🎯 Em 3 Passos

### Passo 1️⃣: GitHub
```bash
git init
git add .
git commit -m "TikTok Stock Sync"
git branch -M main
git remote add origin https://github.com/seu-usuario/tiktok-stock-sync.git
git push -u origin main
```

### Passo 2️⃣: Railway
1. Acesse https://railway.app
2. Clique "Sign Up" → "GitHub"
3. Clique "New Project" → "Deploy from GitHub"
4. Selecione `tiktok-stock-sync`
5. Aguarde build (2-5 min)

### Passo 3️⃣: Variáveis
No Railway, vá para **Variables** e adicione:

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu-secret-aleatorio
VITE_APP_ID=seu-app-id-manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Guilherme Gomes
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
NODE_ENV=production
PORT=3000
```

---

## 🌐 Domínio

### Railway
1. Settings → Domains
2. Add Domain: `gbstocksync.sbs`
3. Copiar registros DNS

### Hostinger
1. hpanel.hostinger.com
2. Domínios → gbstocksync.sbs → DNS
3. Adicionar CNAME do Railway
4. Salvar

---

## ✅ Pronto!

Acesse https://gbstocksync.sbs em 5-30 minutos! 🚀

---

## 📚 Guias Completos
- `DEPLOYMENT_RAILWAY.md` - Guia detalhado
- `DEPLOYMENT_CHECKLIST.md` - Checklist passo-a-passo
- `.env.example` - Template de variáveis
