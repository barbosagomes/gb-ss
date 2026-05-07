#!/bin/bash
set -e

echo "Starting TikTok Stock Sync application..."

# Run database migration on startup
echo "[Startup] Running database migration..."
node migrate.mjs || echo "[Startup] Migration skipped or failed (non-fatal)"

# Run the application
exec node dist/index.js
