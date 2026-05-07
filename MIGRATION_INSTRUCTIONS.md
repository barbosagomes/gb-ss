# Instruções de Migração do Banco de Dados

## Tabelas de Controle Financeiro

As seguintes tabelas foram adicionadas ao schema para suportar o módulo de controle financeiro:

### 1. `product_costs`
Armazena o custo detalhado de cada SKU:
- `productCost`: Custo do produto
- `labelCost`: Custo da etiqueta
- `packagingCost`: Custo da embalagem
- `bubbleWrapCost`: Custo do plástico bolha
- `otherCosts`: Outros custos
- `totalCost`: Total calculado automaticamente

### 2. `financial_metrics`
Armazena métricas financeiras diárias:
- `metricDate`: Data do registro (YYYY-MM-DD)
- `totalCostDay`: Custo total do dia
- `estimatedRevenueDay`: Receita estimada do dia
- `estimatedProfitDay`: Lucro estimado do dia
- `averageProfitMargin`: Margem média de lucro em %
- `productsCount`: Quantidade de produtos vendidos
- `skusCount`: Quantidade de SKUs vendidos

### 3. `sku_pricing`
Armazena preço de venda e margem de lucro por SKU:
- `sellingPrice`: Preço de venda
- `profitMarginPercent`: Margem de lucro em %
- `profitMarginValue`: Valor da margem de lucro

## Como Aplicar a Migração

Use o comando `webdev_execute_sql` com o SQL gerado em `drizzle/0002_young_ego.sql`.

## Validação

Após aplicar a migração, verifique se as tabelas foram criadas:

```sql
SHOW TABLES;
DESCRIBE product_costs;
DESCRIBE financial_metrics;
DESCRIBE sku_pricing;
```
