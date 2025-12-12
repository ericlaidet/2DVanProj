# 2DVanProj

![CI/CD Pipeline](https://github.com/ericlaidet/2DVanProj/workflows/CI%2FCD%20Pipeline/badge.svg)

## 📋 Description

Application de planification d'aménagement de van avec visualisation 2D/3D et génération de layouts assistée par IA.

## 🚀 Technologies

- **Frontend**: React + Vite + TypeScript
- **Backend**: NestJS + Prisma + PostgreSQL
- **Tests**: Playwright (E2E) + Vitest (Unit)
- **CI/CD**: GitHub Actions

## 🛠️ Installation

```bash
# Installer les dépendances
pnpm install

# Démarrer la base de données (Docker)
docker-compose up -d

# Démarrer le backend
pnpm dev:api

# Démarrer le frontend
pnpm dev:web
```

## 🧪 Tests

```bash
# Tests E2E
pnpm test:e2e

# Tests unitaires
pnpm test

# Lint
pnpm lint
```

## 📦 Build

```bash
pnpm build
```

## 📊 CI/CD

Le projet utilise GitHub Actions pour :
- ✅ Build automatique
- ✅ Linting
- ✅ Tests unitaires
- ✅ Tests E2E avec base de données PostgreSQL

Le badge ci-dessus indique l'état de la dernière build.
