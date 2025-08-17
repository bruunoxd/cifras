#!/bin/bash

# Script simplificado para abrir no Xcode
set -e

echo "🚀 Preparando app para execução no iOS..."

# Build do projeto web
echo "📦 Fazendo build do projeto web..."
npm run build

# Sync com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync ios

# Abrir Xcode
echo "📱 Abrindo Xcode - Execute manualmente clicando no botão Play..."
npx cap open ios

echo "✅ Xcode aberto!"
echo "💡 Para executar o app:"
echo "   1. Selecione 'iPhone 16 Pro Max' no topo do Xcode"
echo "   2. Clique no botão ▶️ (Play) para executar"
echo "   3. O app será instalado no simulador como app nativo!"
