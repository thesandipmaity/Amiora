#!/bin/bash
# ─── Amiora VPS Deploy Script ─────────────────────────────────────────────────
# Run this on your Hostinger VPS after first-time setup
# Usage: bash scripts/deploy-vps.sh

set -e

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔨 Building all apps..."
pnpm run build

echo "✅ Build complete!"
echo ""
echo "🚀 Restart apps with PM2:"
echo "   pm2 restart amiora-web"
echo "   pm2 restart amiora-cms"
