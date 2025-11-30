# 🚐 VanPlanner - Éditeur 2D d'aménagement de van

Application web pour concevoir et visualiser l'aménagement intérieur de votre van.

## ✨ Fonctionnalités

- 🎨 **Éditeur visuel** : Canvas interactif avec drag & drop
- 🚐 **21 modèles de vans** : Du Kangoo au Sprinter XXL
- 💾 **Sauvegarde cloud** : Vos plans accessibles partout
- 👥 **Multi-utilisateurs** : Authentification JWT sécurisée
- 📊 **Gestion des plans** : Créer, modifier, supprimer
- 🤖 **Assistant IA** : Génération automatique de layouts (PRO)
- 🎭 **Mode sombre** : Interface adaptative
- 📱 **Responsive** : Fonctionne sur mobile et desktop

---

## 🤖 Fonctionnalités IA (PRO)

### Génération automatique de layouts
Décrivez votre aménagement idéal en langage naturel, l'IA génère un plan optimisé :

```
"Je veux un lit fixe à l'arrière pour 2 personnes, 
une kitchenette compacte côté droit, 
et beaucoup de rangements en hauteur"
```

### Optimisation de plans existants
L'IA analyse vos plans et propose des améliorations :
- Ergonomie optimisée
- Meilleure circulation
- Répartition du poids équilibrée

### Apprentissage des préférences
L'IA apprend de vos layouts précédents pour personnaliser ses suggestions.

**Abonnements** :
- FREE : Pas d'accès IA
- PRO1 : 3 générations/jour
- PRO2 : 20 générations/jour + optimisation
- PRO3 : Illimité

---

## 🏗️ Architecture

```
VanPlanner/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── ai/       # 🤖 Module IA
│   │   │   ├── auth/     # Authentification
│   │   │   ├── plans/    # Gestion des plans
│   │   │   └── prisma/   # ORM Database
│   │   └── prisma/
│   │       └── schema.prisma
│   └── web/              # Frontend React
│       ├── src/
│       │   ├── features/
│       │   │   └── ai/   # 🤖 Composants IA
│       │   ├── hooks/
│       │   ├── components/
│       │   └── pages/
│       └── package.json
├── .env
└── package.json
```

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- pnpm 10+
- PostgreSQL 15+
- Clé API OpenAI (pour fonctionnalités IA)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/vanplanner.git
cd vanplanner
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Configuration
Créer un fichier `.env` à la racine :
```bash
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/vanplanner"

# JWT
JWT_SECRET=votre-secret-jwt-super-long-et-securise

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000

# 🤖 IA (optionnel)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
```

### 4. Base de données
```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
npx ts-node prisma/seed.ts
```

### 5. Lancer en développement
```bash
# Terminal 1 - Backend
pnpm dev:api

# Terminal 2 - Frontend
pnpm dev:web
```

L'application est accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:3000

---

## 🤖 Configuration IA

### 1. Obtenir une clé OpenAI
1. Créer un compte sur [platform.openai.com](https://platform.openai.com/)
2. Ajouter une méthode de paiement
3. Générer une clé API dans [API Keys](https://platform.openai.com/api-keys)

### 2. Ajouter la clé dans `.env`
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. (Optionnel) Tracking usage IA
Pour suivre les coûts, ajouter la table `AIUsage` :
```bash
cd apps/api
npx prisma migrate dev --name add_ai_usage_tracking
npx prisma generate
```

### 4. Tester
```bash
# Health check IA
curl http://localhost:3000/ai/health

# Générer un layout (nécessite token JWT)
curl -X POST http://localhost:3000/ai/generate-layout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vanType": "MERCEDES_SPRINTER_L3H2",
    "userDescription": "Test layout",
    "preferences": {
      "sleepingCapacity": 2,
      "hasCooking": true,
      "style": "modern"
    }
  }'
```

---

## 📦 Build production

```bash
# Build tout
pnpm build

# Build backend seulement
cd apps/api && pnpm build

# Build frontend seulement
cd apps/web && pnpm build
```

---

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests avec UI
pnpm test:ui

# Tests E2E
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 📚 Documentation

- [Fonctionnalités IA](./docs/AI_FEATURES.md)
- [Guide de déploiement](./VanPlanner_Deployment_Guide.pdf)
- [API Documentation](./docs/API.md)

---

## 🛠️ Technologies

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM TypeScript
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **OpenAI GPT-4** - Génération IA

### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Konva** - Canvas 2D
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

---

## 🔒 Sécurité

- Authentification JWT avec sessions
- Validation des inputs (class-validator)
- Rate limiting (200 req/15min)
- Helmet.js (headers sécurisés)
- CORS configuré
- Mots de passe hashés (bcrypt)

---

## 📝 License

MIT

---

## 👥 Contributeurs

- Votre Nom - Développeur principal

---

## 🆘 Support

En cas de problème :
1. Consulter les [Issues GitHub](https://github.com/votre-repo/vanplanner/issues)
2. Lire la [documentation IA](./docs/AI_FEATURES.md)
3. Vérifier les logs : `pnpm dev:api` et `pnpm dev:web`

---

## 🎯 Roadmap

- [ ] Export PDF des plans
- [ ] Collaboration temps réel
- [ ] Bibliothèque de meubles 3D
- [ ] Calcul automatique du poids
- [ ] Application mobile native
- [ ] Intégration avec fabricants de meubles
