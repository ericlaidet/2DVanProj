#!/bin/bash

# =============================================
# 🚀 SCRIPT D'INSTALLATION - COUCHE IA
# =============================================

echo "📦 Installation des dépendances IA..."

# =============================================
# 1️⃣ PHASE 1 - NETTOYAGE
# =============================================

#
#echo ""
#echo "🗑️ Phase 1 : Nettoyage des fichiers dupliqués..."

## Supprimer doublons backend
#rm -f apps/api/src/ai/ai.controller.ts
#rm -f apps/api/src/ai/ai.service.ts

## Supprimer fichiers obsolètes frontend
#rm -f apps/web/src/Login.tsx
#rm -f apps/web/src/index.tsx
#rm -f apps/web/src/login.css

#echo "✅ Fichiers dupliqués supprimés"

# =============================================
# 2️⃣ PHASE 2 - STRUCTURE BACKEND
# =============================================

echo ""
echo "🏗️ Phase 2 : Création de la structure backend..."

# Créer répertoires
mkdir -p apps/api/src/ai/services
mkdir -p apps/api/src/ai/controllers
mkdir -p apps/api/src/ai/guards
mkdir -p apps/api/src/ai/interceptors
mkdir -p apps/api/src/ai/config
mkdir -p apps/api/src/ai/__tests__

echo "✅ Structure backend créée"

# =============================================
# 3️⃣ PHASE 3 - STRUCTURE FRONTEND
# =============================================

echo ""
echo "🎨 Phase 3 : Création de la structure frontend..."

# Créer répertoires
mkdir -p apps/web/src/features/ai
mkdir -p apps/web/src/features/ai/__tests__
mkdir -p apps/web/src/hooks/__tests__

echo "✅ Structure frontend créée"

# =============================================
# 4️⃣ PHASE 4 - VÉRIFICATION DÉPENDANCES
# =============================================

echo ""
echo "📦 Phase 4 : Vérification des dépendances..."

# Vérifier si openai est installé
cd apps/api
if ! grep -q '"openai"' package.json; then
  echo "⚠️ openai n'est pas installé, installation en cours..."
  pnpm add openai
else
  echo "✅ openai déjà installé"
fi

# Vérifier uuid pour frontend
cd ../../apps/web
if ! grep -q '"uuid"' package.json; then
  echo "⚠️ uuid n'est pas installé, installation en cours..."
  pnpm add uuid
  pnpm add -D @types/uuid
else
  echo "✅ uuid déjà installé"
fi

cd ../..

# =============================================
# 5️⃣ PHASE 5 - CONFIGURATION
# =============================================

echo ""
echo "⚙️ Phase 5 : Vérification configuration..."

# Vérifier si OPENAI_API_KEY existe dans .env
if ! grep -q "OPENAI_API_KEY" .env 2>/dev/null; then
  echo "⚠️ OPENAI_API_KEY manquant dans .env"
  echo ""
  echo "Ajoutez cette ligne dans votre fichier .env :"
  echo "OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  echo ""
  echo "Obtenez votre clé sur : https://platform.openai.com/api-keys"
else
  echo "✅ OPENAI_API_KEY trouvé dans .env"
fi

# =============================================
# 6️⃣ PHASE 6 - BASE DE DONNÉES (optionnel)
# =============================================

echo ""
echo "💾 Phase 6 : Migration base de données (optionnel)..."
echo "Voulez-vous ajouter le tracking d'usage IA ? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
  echo "📝 Ajoutez le modèle AIUsage dans apps/api/prisma/schema.prisma"
  echo "Puis exécutez :"
  echo "  cd apps/api"
  echo "  npx prisma migrate dev --name add_ai_usage_tracking"
  echo "  npx prisma generate"
else
  echo "⏭️ Tracking IA ignoré"
fi

# =============================================
# 7️⃣ PHASE 7 - TESTS
# =============================================

echo ""
echo "🧪 Phase 7 : Configuration des tests..."

# Vérifier si vitest est configuré
if ! grep -q "vitest" package.json 2>/dev/null; then
  echo "⚠️ vitest non trouvé - les tests ne fonctionneront pas"
else
  echo "✅ vitest configuré"
fi

# =============================================
# 8️⃣ RÉCAPITULATIF
# =============================================

echo ""
echo "=========================================="
echo "✅ INSTALLATION TERMINÉE"
echo "=========================================="
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1️⃣ Copier les fichiers depuis les artifacts :"
echo "   - Backend : services, controllers, guards"
echo "   - Frontend : AIAssistant, useAI hook"
echo ""
echo "2️⃣ Configurer votre clé OpenAI :"
echo "   - Ajouter OPENAI_API_KEY dans .env"
echo "   - Obtenir sur https://platform.openai.com/api-keys"
echo ""
echo "3️⃣ Mettre à jour les imports :"
echo "   - AppModule : importer AIModule"
echo "   - App.tsx : importer AIAssistant"
echo ""
echo "4️⃣ Tester en local :"
echo "   pnpm dev:api    # Terminal 1"
echo "   pnpm dev:web    # Terminal 2"
echo ""
echo "5️⃣ Vérifier les endpoints IA :"
echo "   POST http://localhost:3000/ai/generate-layout"
echo "   POST http://localhost:3000/ai/optimize-plan"
echo "   GET  http://localhost:3000/ai/preferences"
echo ""
echo "=========================================="

# =============================================
# 🔍 VÉRIFICATIONS FINALES
# =============================================

echo ""
echo "🔍 Vérifications finales..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "⚠️ Node.js version trop ancienne ($(node -v)). Recommandé : v18+"
else
  echo "✅ Node.js version OK ($(node -v))"
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
  echo "⚠️ pnpm non trouvé. Installez avec : npm install -g pnpm"
else
  echo "✅ pnpm installé ($(pnpm -v))"
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
  echo "✅ PostgreSQL trouvé"
else
  echo "⚠️ PostgreSQL non trouvé sur le système"
fi

echo ""
echo "🎉 Setup complet !"
echo ""
