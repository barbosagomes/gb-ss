# Build stage
FROM node:20 AS builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@10.4.1

# Copiar package.json e pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código-fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm@10.4.1

# Copiar package.json e pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar arquivos built do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Copiar script de inicialização
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expor porta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Iniciar aplicação usando o script
CMD ["./start.sh"]
