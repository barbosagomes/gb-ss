# Multi-stage build
FROM node:20 as builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy patches directory
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/start.sh ./start.sh

# Make start.sh executable
RUN chmod +x ./start.sh

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["./start.sh"]
