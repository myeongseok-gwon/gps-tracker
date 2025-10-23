#!/bin/bash

echo "🚀 Deploying GPS Tracker to Vercel..."

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
