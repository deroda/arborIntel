#!/bin/bash

echo "🚀 Preparing ArborIntel 2035 for Live Beta Launch..."

# 1. Server Setup
echo "🔹 [1/3] Setting up Backend (Firebase + Express)..."
cd server
if [ ! -f "config/serviceAccountKey.json" ]; then
    echo "⚠️  WARNING: config/serviceAccountKey.json is missing!"
    echo "   You must place your Firebase Admin SDK key there for Persistence to work."
    echo "   Creating a placeholder directory if needed..."
    mkdir -p config
fi
npm install
cd ..

# 2. Client Build
echo "🔹 [2/3] Building Frontend (Vite -> /dist)..."
cd client
npm install
npm run build
cd ..

# 3. Launch
echo "🔹 [3/3] Launching Production Server..."
echo "✅ App will be available at http://localhost:3001"
echo "   Ctl+C to stop."

cd server
export NODE_ENV=production
node index.js
