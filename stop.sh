#!/bin/bash

# ✨ HabitFlow - Stop Script
# 🛑 Stops all services

echo ""
echo "🛑 =================================="
echo "   Stopping HabitFlow Services"
echo "================================== 🛑"
echo ""

# 🐳 Stop PostgreSQL
echo "🐳 Stopping PostgreSQL..."
docker compose down 2>/dev/null
echo "   ✅ PostgreSQL stopped"
echo ""

# 🦙 Stop Ollama
echo "🦙 Stopping Ollama..."
if pgrep -x "ollama" > /dev/null; then
    pkill -x "ollama" 2>/dev/null
    echo "   ✅ Ollama stopped"
else
    echo "   ℹ️  Ollama was not running"
fi
echo ""

echo "💜 All services stopped. See you next time!"
echo ""
