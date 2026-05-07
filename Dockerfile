# Single stage - just run the server without building client
FROM node:20

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

# Try to build, but show errors
RUN pnpm run build 2>&1 || true

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["./start.sh"]
