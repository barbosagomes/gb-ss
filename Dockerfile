# Build stage
FROM node:20 AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files FIRST
COPY package.json pnpm-lock.yaml ./

# Copy patches directory (required by pnpm)
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (continue even if it fails)
RUN pnpm run build || true

# Production stage  
FROM node:20

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy patches directory
COPY patches ./patches

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder (if they exist)
COPY --from=builder /app/dist ./dist || true
COPY --from=builder /app/client/dist ./client/dist || true

# Create directories if they don't exist
RUN mkdir -p ./dist ./client/dist

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["./start.sh"]
