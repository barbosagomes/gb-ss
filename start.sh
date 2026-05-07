#!/bin/bash
set -e

echo "Starting TikTok Stock Sync application..."

# Run the application
exec node dist/index.js
