#!/bin/bash

# Claro Monorepo Startup Script
# This script starts all applications in the monorepo

set -e

echo "🚀 Starting Claro Monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install workspace dependencies
echo "📦 Installing workspace dependencies..."
npx turbo run install

# Check if ports are available
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use by $service"
        echo "   Stopping process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
}

# Check and clear ports
echo "🔍 Checking port availability..."
check_port 3001 "API"
check_port 3002 "Web"
check_port 8082 "Mobile Expo"

# Start all applications using Turbo
echo "🚀 Starting all applications..."
npx turbo run dev

echo "✅ All applications started successfully!"
echo ""
echo "📱 Applications running:"
echo "   🌐 Web App: http://localhost:3002"
echo "   🔌 API: http://localhost:3001"
echo "   📱 Mobile: Expo DevTools"
echo ""
echo "Press Ctrl+C to stop all applications" 