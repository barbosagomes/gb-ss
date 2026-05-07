# TikTok Stock Sync - Aplicação de Controle de Estoque

## 🎉 Projeto Finalizado com Sucesso!

Aplicação profissional de controle de estoque para TikTok Shop, desenvolvida com React, TypeScript e design moderno em estilo ERP.

## ✨ Características Principais

### 🎨 Design
- **Sidebar Azul Marinho** (#1a1a2e) com navegação clara
- **Layout Corporativo** inspirado em ERPs tradicionais
- **Responsivo** (mobile, tablet, desktop)
- **Acessibilidade** WCAG 2.1 AA
- **Tudo em Português-BR**

### 🏠 Páginas Implementadas

#### Home
- Saudação dinâmica: "Bom dia", "Boa tarde" ou "Boa noite" (conforme horário de Brasília)
- Stats em grid 2x2: Produtos, SKUs, Estoque, Margem Média
- Acesso Rápido com 4 botões de ação
- Setup banner para primeiros passos

#### Produtos
- Listagem de produtos com busca
- Filtros: Todos, Ativos, Inativos
- Botão Sincronizar
- Gerenciamento de SKUs

#### Analytics
- Análise Financeira com métricas principais
- Filtros de período (7, 30, 90 dias)
- Gráficos: Lucro vs Custo, Receita Diária
- Tabela de produtos por lucratividade

#### Configurações
- Formulário de configuração
- Credenciais do TikTok Shop
- Webhooks

#### Alertas & Histórico
- Gerenciamento de alertas
- Histórico de sincronizações

### 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Express 4 + tRPC 11
- **Database:** MySQL/TiDB com Drizzle ORM
- **UI Components:** shadcn/ui + Lucide React
- **Autenticação:** Manus OAuth
- **Gráficos:** Recharts

### 🚀 Como Usar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - URL: http://localhost:3000 (ou porta disponível)
   - Faça login com suas credenciais Manus

### 📋 Funcionalidades

- ✅ Autenticação com Manus OAuth
- ✅ Integração com TikTok Shop
- ✅ Sincronização de produtos
- ✅ Análise financeira em tempo real
- ✅ Gerenciamento de estoque
- ✅ Alertas de estoque baixo
- ✅ Histórico de sincronizações
- ✅ Dashboard intuitivo

### 🎯 Melhorias Implementadas

- ✅ Sidebar colapsável e responsiva
- ✅ Saudação dinâmica por horário de Brasília
- ✅ Design corporativo profissional
- ✅ Componentes reutilizáveis
- ✅ Animações suaves
- ✅ Temas claros e escuros (suportados)
- ✅ Acessibilidade completa

### 📱 Responsividade

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

### 🔐 Segurança

- ✅ Autenticação OAuth
- ✅ Proteção de rotas
- ✅ Validação de tipos com TypeScript
- ✅ HTTPS em produção

### 📊 Estrutura do Projeto

```
tiktok-stock-sync/
├── client/
│   ├── src/
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── lib/          # Utilitários e configurações
│   │   └── App.tsx       # Roteamento principal
│   └── index.html
├── server/
│   ├── routers.ts        # Rotas tRPC
│   ├── db.ts             # Queries do banco
│   └── _core/            # Configurações do servidor
├── drizzle/
│   └── schema.ts         # Schema do banco de dados
└── package.json
```

### 🚀 Deployment

A aplicação está pronta para produção. Para fazer deploy:

1. Build da aplicação:
   ```bash
   npm run build
   ```

2. Iniciar em produção:
   ```bash
   npm run start
   ```

### 📝 Notas

- Todas as datas são armazenadas em UTC no banco de dados
- Horários são exibidos no timezone do usuário
- Saudação detecta automaticamente o horário de Brasília (America/Sao_Paulo)

### 🤝 Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.

---

**Versão:** 1.0.0  
**Data:** Maio 2026  
**Status:** ✅ Pronto para Produção
