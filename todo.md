# TikTok Stock Sync - TODO

## Fase 1: Configuração do Portal TikTok Shop Partner
- [x] Criar aplicativo no portal de desenvolvedor (tipo Custom, categoria Catalog/Product Listing)
- [x] Obter App Key e App Secret
- [x] Configurar Redirect URL para callback OAuth
- [x] Habilitar acesso à API
- [x] Validar credenciais com testes vitest
- [ ] Configurar webhook para Inventory Changed (#68)
- [ ] Configurar webhook para Order Status Change (#1)
- [ ] Testar credenciais no ambiente Sandbox

## Fase 2: Infraestrutura Backend
- [x] Criar tabelas Drizzle: tiktok_apps, access_tokens, products, skus, sync_logs, sync_errors
- [x] Implementar helpers de banco de dados em server/db-tiktok.ts
- [x] Criar procedimentos tRPC para OAuth, produtos, SKUs e logs em server/routers.ts
- [x] Implementar endpoint HTTPS para webhooks com verificação HMAC-SHA256 em server/webhooks.ts
- [ ] Implementar renovação automática de access_token

## Fase 3: Integração com API do TikTok Shop
- [x] Implementar fluxo OAuth (autorização, callback, armazenamento de tokens) em server/tiktok-api.ts
- [x] Implementar chamada à API de listagem de produtos
- [x] Implementar chamada à API de listagem de SKUs
- [x] Implementar chamada à API de atualização de estoque (Programa → TikTok Shop)
- [x] Implementar processamento de webhooks (Inventory Changed e Order Status Change) em server/webhook-handler.ts
- [x] Implementar sincronização bidirecional de estoque

## Fase 4: Painel de Controle (Dashboard)
- [x] Criar página de visão geral (Home.tsx) com status de sincronização
- [x] Criar página de listagem de produtos e SKUs (Products.tsx)
- [x] Criar página de configurações (Settings.tsx) com App Key, App Secret, Redirect URL, Sandbox/Produção
- [x] Criar página de análise financeira (Analytics.tsx) com gráficos
- [x] Registrar webhooks no servidor Express em server/_core/index.ts
- [x] Criar página de logs de sincronização (SyncLogs.tsx)
- [x] Criar página de alertas (Alerts.tsx)
- [ ] Criar layout DashboardLayout com sidebar
- [ ] Implementar filtros e busca em listagens
- [ ] Implementar paginação

## Fase 5: Notificações e Alertas
- [ ] Implementar sistema de alertas para erros de sincronização
- [ ] Implementar notificações ao dono via notifyOwner
- [ ] Criar página de histórico de alertas
- [ ] Implementar retry automático para sincronizações falhadas

## Fase 6: Testes e Validação
- [ ] Escrever testes unitários para helpers de banco de dados
- [ ] Escrever testes para verificação de assinatura HMAC-SHA256
- [ ] Testar fluxo OAuth completo
- [ ] Testar sincronização bidirecional
- [ ] Testar webhooks
- [ ] Validar ambiente Sandbox vs Produção

## Fase 7: Localização e UX
- [x] Configurar formatação para Português Brasileiro em client/src/hooks/useFormatting.ts
- [x] Formatar datas em pt-BR
- [x] Formatar moeda em BRL
- [ ] Revisar textos e mensagens para clareza
- [x] Implementar design elegante e refinado com tema OKLCH

## Fase 8: Documentação e Entrega
- [x] Documentar fluxo de autorização OAuth (README.md)
- [x] Documentar endpoints de webhook (README.md)
- [x] Documentar estrutura de banco de dados (README.md)
- [x] Documentar guia de uso do painel (GUIA_TESTES.md)
- [x] Preparar credenciais para o usuário (integradas no sistema)
- [x] Criar README com instruções de setup (README.md)


## Fase 6: Módulo de Controle Financeiro (NOVO)
- [x] Criar tabelas Drizzle: product_costs, financial_metrics, sku_pricing
- [x] Implementar helpers para cálculo de custos e margens em server/db-financial.ts
- [x] Criar procedimentos tRPC para gerenciar custos de produtos em server/routers-financial.ts
- [x] Implementar cálculo de custo total por SKU (produto + etiqueta + embalagem + plástico bolha + outros)
- [x] Implementar cálculo de margem de lucro por SKU
- [x] Criar dashboard de análise financeira (Analytics.tsx) com:
  - [x] Custo total diário
  - [x] Receita estimada diária
  - [x] Lucro estimado diário
  - [x] Margem de lucro média
  - [x] Produtos mais lucrativos
  - [x] Produtos com menor margem
  - [x] Gráficos de tendência (Recharts)
- [ ] Implementar relatórios financeiros exportáveis
- [x] Criar tela de configuração de custos por SKU (Products.tsx)
- [ ] Implementar alertas de produtos com margem baixa
