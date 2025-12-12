# 🧪 Tests E2E Playwright - Van Planner

## � Structure des tests

Les tests sont organisés en 3 catégories :

```
tests/
├── 01_InitialTests/          # Tests initiaux et d'intégration
│   ├── api-integration.spec.ts
│   ├── debug-add-furniture.spec.ts
│   ├── debug-dom-dump.spec.ts
│   └── van-selection.spec.ts
├── 02_Furnitures/            # Tests d'ajout de meubles
│   ├── diagnostic-furniture.spec.ts
│   └── furniture-addition.spec.ts
└── 03_LoginNavigation/       # Tests de login et navigation
    ├── login.spec.ts
    └── navigation.spec.ts
```

## ⚙️ Avant de lancer

1. **Démarrez le serveur backend** :
   ```powershell
   pnpm dev:api
   ```

2. **Démarrez le serveur frontend** :
   ```powershell
   pnpm dev:web
   ```
   Attendez de voir: `➜  Local:   http://localhost:5173/`

3. **Vérifiez les identifiants** dans les tests de login :
   ```typescript
   const VALID_EMAIL = 'sonik.vigbea@gmail.com';
   const VALID_PASSWORD = 'Sonik123';
   ```

## 🚀 Lancer les tests

### Mode UI (recommandé pour débuter)
```powershell
pnpm test:e2e:ui
```

### Mode headless (console)
```powershell
pnpm test:e2e
```

### Lancer un dossier spécifique
```powershell
# Tests de login/navigation
pnpm test:e2e tests/03_LoginNavigation

# Tests de meubles
pnpm test:e2e tests/02_Furnitures

# Tests initiaux
pnpm test:e2e tests/01_InitialTests
```

### Lancer un test spécifique
```powershell
pnpm test:e2e tests/03_LoginNavigation/login.spec.ts
```

## 📸 Tests disponibles

### 📂 01_InitialTests - Tests initiaux et diagnostics

#### `van-selection.spec.ts`
- ✅ Modal de sélection s'ouvre
- ✅ Peut sélectionner un Mercedes Sprinter
- ✅ Canvas s'affiche après sélection
- ✅ Dimensions du van affichées
- ✅ Toggle 2D/3D visible
- ✅ Peut changer de van

#### `api-integration.spec.ts`
- ✅ Sauvegarde de plan : UI → API → DB
- ✅ Test de santé API

#### `debug-add-furniture.spec.ts` & `debug-dom-dump.spec.ts`
- 🔧 Tests de diagnostic pour débugger l'ajout de meubles

### 📂 02_Furnitures - Tests d'ajout de meubles

#### `furniture-addition.spec.ts`
- ✅ Palette de meubles visible
- ✅ Ajouter un lit depuis la palette
- ✅ Ajouter une cuisine depuis la palette
- ✅ Ajouter plusieurs meubles
- ✅ Toggle 2D/3D avec meubles
- ✅ Meubles persistent après toggle
- ✅ Formulaire personnalisé visible

#### `diagnostic-furniture.spec.ts`
- 🔧 Tests de diagnostic pour vérifier le rendu des meubles

### 📂 03_LoginNavigation - Tests de login et navigation

#### `login.spec.ts`
- ✅ Login réussi avec bons identifiants
- ❌ Mot de passe incorrect - vérifie le message d'erreur

#### `navigation.spec.ts`
- ✅ Page principale accessible après login
- ✅ Header et navigation visibles
- ✅ Bouton sélection de van visible
- ✅ Workspace visible
- ✅ Déconnexion fonctionne
- ✅ Navigation reste cohérente

## 🐛 Si ça ne marche pas

1. Vérifiez que le backend tourne sur http://localhost:3000
2. Vérifiez que le frontend tourne sur http://localhost:5173
3. Vérifiez les identifiants dans les fichiers de test
4. Vérifiez que la base de données PostgreSQL est démarrée (Docker)

## 🔄 CI/CD

Ces tests sont automatiquement exécutés dans GitHub Actions à chaque push.
Voir `.github/workflows/ci.yml` pour la configuration.

