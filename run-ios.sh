#!/bin/bash

# Script para executar o app iOS
set -e

echo "🚀 Iniciando build e execução do app iOS..."

# Build do projeto web
echo "📦 Fazendo build do projeto web..."
npm run build

# Sync com Capacitor
echo "🔄 Sincronizando com Capacitor..."
npx cap sync ios

# Executar no simulador
echo "📱 Executando no simulador..."
npx cap run ios --target="F61662CD-A16F-46F6-ABA9-3F973BE28721"
