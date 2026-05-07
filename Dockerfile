# Single stage build
FROM node:20

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy all files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm run build || echo "Build failed, but continuing..."

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["./start.sh"]
