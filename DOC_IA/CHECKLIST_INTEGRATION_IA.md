# ✅ Checklist d'intégration IA - VanPlanner

## 📁 Structure des fichiers

### Backend - Services ✅
- [ ] `apps/api/src/ai/services/ai.service.ts`
- [ ] `apps/api/src/ai/services/openai.client.ts`
- [ ] `apps/api/src/ai/services/ai-cache.service.ts`

### Backend - Controllers ✅
- [ ] `apps/api/src/ai/controllers/ai.controller.ts`

### Backend - Guards ✅
- [ ] `apps/api/src/ai/guards/ai-subscription.guard.ts`

### Backend - DTOs ✅
- [ ] `apps/api/src/ai/dto/generate-layout.dto.ts`
- [ ] `apps/api/src/ai/dto/optimize-plan.dto.ts`

### Backend - Types ✅
- [ ] `apps/api/src/ai/types/ai.types.ts`

### Backend - Prompts ✅
- [ ] `apps/api/src/ai/prompts/layout-generator.prompt.ts`
- [ ] `apps/api/src/ai/prompts/design-optimizer.prompt.ts`

### Backend - Utils ✅
- [ ] `apps/api/src/ai/utils/json-validator.ts`

### Backend - Tests ✅
- [ ] `apps/api/src/ai/__tests__/ai.service.spec.ts`
- [ ] `apps/api/src/ai/__tests__/ai.controller.spec.ts`
- [ ] `apps/api/src/ai/__tests__/openai.client.spec.ts`
- [ ] `apps/api/src/ai/__tests__/ai-cache.service.spec.ts`
- [ ] `apps/api/src/ai/__tests__/ai-subscription.guard.spec.ts`

### Backend - Module ✅
- [ ] `apps/api/src/ai/ai.module.ts`

### Frontend - Features ✅
- [ ] `apps/web/src/features/ai/AIAssistant.tsx`
- [ ] `apps/web/src/features/ai/__tests__/AIAssistant.test.tsx`

### Frontend - Hooks ✅
- [ ] `apps/web/src/hooks/useAI.ts`
- [ ] `apps/web/src/hooks/__tests__/useAI.test.ts`

### Frontend - Utils ✅
- [ ] `apps/web/src/utils/van.ts`

---

## 🔧 Modifications des fichiers existants

### Backend ✅
- [ ] `apps/api/src/app.module.ts` - Importer `AIModule`
- [ ] `apps/api/prisma/schema.prisma` - Ajouter modèle `AIUsage` (optionnel)

### Frontend ✅
- [ ] `apps/web/src/pages/App.tsx` - Importer et utiliser `AIAssistant`
- [ ] `apps/web/src/main.tsx` - Vérifier point d'entrée

---

## 🗑️ Fichiers à supprimer

- [ ] `apps/api/src/ai/ai.controller.ts` (ancien, dupliqué dans ai.module.ts)
- [ ] `apps/api/src/ai/ai.service.ts` (ancien, dupliqué dans ai.module.ts)
- [ ] `apps/web/src/Login.tsx` (remplacé par pages/Login.tsx)
- [ ] `apps/web/src/index.tsx` (si vous utilisez main.tsx)
- [ ] `apps/web/src/login.css` (migré vers globals.css)

---

## ⚙️ Configuration

### Variables d'environnement ✅
- [ ] `OPENAI_API_KEY` ajouté dans `.env`
- [ ] `OPENAI_MODEL` configuré (optionnel)
- [ ] `OPENAI_TIMEOUT` configuré (optionnel)
- [ ] `OPENAI_MAX_RETRIES` configuré (optionnel)
- [ ] `AI_LIMIT_*` configurés (optionnel)

### Base de données ✅
- [ ] Modèle `AIUsage` ajouté dans `schema.prisma` (optionnel)
- [ ] Migration exécutée : `npx prisma migrate dev --name add_ai_usage_tracking`
- [ ] Client Prisma régénéré : `npx prisma generate`

---

## 📦 Dépendances

### Backend ✅
- [ ] `openai` installé : `pnpm add openai`

### Frontend ✅
- [ ] `uuid` installé : `pnpm add uuid`
- [ ] `@types/uuid` installé : `pnpm add -D @types/uuid`

---

## 🧪 Tests à exécuter

### Tests unitaires ✅
- [ ] `pnpm test` dans `apps/api`
- [ ] `pnpm test` dans `apps/web`
- [ ] Tous les tests passent

### Tests manuels ✅
- [ ] Backend démarre sans erreur : `pnpm dev:api`
- [ ] Frontend démarre sans erreur : `pnpm dev:web`
- [ ] Connexion utilisateur fonctionne
- [ ] Sélection van fonctionne
- [ ] Composant AIAssistant s'affiche (PRO)
- [ ] Génération layout fonctionne
- [ ] Suggestion s'affiche correctement
- [ ] Application suggestion fonctionne

### Tests API ✅
```bash
# Health check
curl http://localhost:3000/ai/health

# Génération (nécessite token)
curl -X POST http://localhost:3000/ai/generate-
