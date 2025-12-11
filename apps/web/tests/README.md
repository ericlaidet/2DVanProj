# 🧪 Tests Playwright - Login Simple

## 📋 Configuration

Le test se trouve dans `apps/web/tests/login.spec.ts`

## ⚙️ Avant de lancer

1. **Démarrez le serveur** :
   ```powershell
   pnpm dev:web
   ```
   Attendez de voir: `➜  Local:   http://localhost:5173/`

2. **Modifiez les identifiants** dans `login.spec.ts` :
   ```typescript
   const VALID_EMAIL = 'votre-email@example.com';
   const VALID_PASSWORD = 'VotreMotDePasse';
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

### Lancer un test spécifique
```powershell
pnpm test:e2e tests/login.spec.ts
```

## 📸 Tests disponibles

### 1. Tests de login (`login.spec.ts`)
- ✅ **Login réussi** - avec bons identifiants
- ❌ **Mot de passe incorrect** - vérifie le message d'erreur

### 2. Tests de navigation (`navigation.spec.ts`)
- ✅ **Page principale accessible** après login
- ✅ **Header et navigation** visibles
- ✅ **Bouton sélection de van** visible
- ✅ **Workspace** visible
- ✅ **Déconnexion** fonctionne
- ✅ **Navigation** reste cohérente

### 3. Tests de sélection de van (`van-selection.spec.ts`)  
- ✅ **Modal de sélection** s'ouvre
- ✅ **Peut sélectionner** un Mercedes Sprinter
- ✅ **Canvas s'affiche** après sélection
- ✅ **Dimensions du van** affichées
- ✅ **Toggle 2D/3D** visible après sélection
- ✅ **Peut changer** de van

### 4. Tests d'ajout de meubles (`furniture-addition.spec.ts`)
- ✅ **Palette de meubles** visible
- ✅ **Ajouter un lit** depuis la palette
- ✅ **Ajouter une cuisine** depuis la palette
- ✅ **Ajouter plusieurs meubles**
- ✅ **Toggle 2D/3D** avec meubles
- ✅ **Meubles persistent** après toggle
- ✅ **Formulaire personnalisé** visible

## 🐛 Si ça ne marche pas

1. Vérifiez que le serveur tourne sur http://localhost:5173
2. Vérifiez les identifiants dans le fichier de test
3. Adaptez les sélecteurs si votre HTML est différent
