#!/bin/bash

# ✨ HabitFlow - Startup Script
# 🚀 Starts all services needed for development

set -e

echo ""
echo "✨ =================================="
echo "   HabitFlow - AI Habit Tracker"
echo "================================== ✨"
echo ""

# 🐳 Start PostgreSQL via Docker
echo "🐳 Starting PostgreSQL database..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose up -d postgres
echo "   ✅ PostgreSQL is running on port 5432"
echo ""

# 🦙 Check and start Ollama
echo "🦙 Checking Ollama..."
if command -v ollama &> /dev/null; then
    echo "   ✅ Ollama is installed"

    # Check if Ollama is already running
    if pgrep -x "ollama" > /dev/null || curl -s http://localhost:11434/api/tags &> /dev/null; then
        echo "   ✅ Ollama is already running"
    else
        echo "   🔄 Starting Ollama server..."
        ollama serve &> /dev/null &
        sleep 2
        echo "   ✅ Ollama server started"
    fi

    # Check if llama3.2 model is available
    echo "   🔍 Checking for Llama 3.2 model..."
    if ollama list | grep -q "llama3.2"; then
        echo "   ✅ Llama 3.2 model is ready"
    else
        echo "   📥 Pulling Llama 3.2 model (this may take a few minutes)..."
        ollama pull llama3.2
        echo "   ✅ Llama 3.2 model downloaded"
    fi
else
    echo "   ⚠️  Ollama not found"
    echo ""

    # Check if we're on macOS and have brew
    if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &> /dev/null; then
        read -p "   Would you like to install Ollama via Homebrew? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "   📥 Installing Ollama..."
            brew install ollama
            echo "   ✅ Ollama installed"
            echo ""
            echo "   🔄 Starting Ollama server..."
            ollama serve &> /dev/null &
            sleep 2
            echo "   ✅ Ollama server started"
            echo ""
            echo "   📥 Pulling Llama 3.2 model (this may take a few minutes)..."
            ollama pull llama3.2
            echo "   ✅ Llama 3.2 model downloaded"
        else
            echo "   💡 Skipping Ollama - AI features will use fallback responses"
        fi
    else
        echo "   💡 Install Ollama manually from: https://ollama.ai"
        echo "   💡 AI features will use fallback responses for now"
    fi
fi
echo ""

# 📦 Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo "   ✅ Dependencies installed"
    echo ""
fi

# 🗄️ Generate Prisma client if needed
if [ ! -d "src/generated/prisma" ]; then
    echo "🗄️  Generating Prisma client..."
    pnpm prisma generate
    echo "   ✅ Prisma client generated"
    echo ""
fi

# 🔄 Push database schema
echo "🗄️  Syncing database schema..."
pnpm prisma db push
echo "   ✅ Database schema synced"
echo ""

# 🚀 Start the development server
echo "🚀 Starting Next.js development server..."
echo ""
echo "💜 =================================="
echo "   App running at: http://localhost:3000"
echo "   Database: localhost:5432"
echo "   Ollama API: localhost:11434"
echo "================================== 💜"
echo ""

pnpm dev
