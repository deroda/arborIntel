#!/bin/bash

# ArborIntel 2035 Vision 0.1 Startup Script

echo "🚀 Starting ArborIntel 2035 Ecosystem..."

# Start Backend
cd server
node index.js &
SERVER_PID=$!
cd ..

# Start Frontend
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Systems Online."
echo "Dashboard: http://localhost:5173"
echo "API: http://localhost:3001"

# Handle termination
trap "kill $SERVER_PID $FRONTEND_PID" EXIT
wait
