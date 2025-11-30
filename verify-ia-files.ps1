# Script de vérification des fichiers IA - VanPlanner
# Usage: .\verify-ia-files.ps1

Write-Host "`n🔍 Vérification des fichiers IA..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$FOUND = 0
$MISSING = 0
$MODIFIED = 0

# Fonction de vérification
function Check-File {
    param(
        [string]$Path,
        [string]$Category
    )
    
    if (Test-Path $Path) {
        Write-Host "✅ $Path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ MANQUANT: $Path" -ForegroundColor Red
        return $false
    }
}

# Fonction de vérification de contenu
function Check-FileContent {
    param(
        [string]$Path,
        [string]$SearchString
    )
    
    if (Test-Path $Path) {
        $content = Get-Content $Path -Raw
        if ($content -match [regex]::Escape($SearchString)) {
            return $true
        }
    }
    return $false
}

# ============================================
# NOUVEAUX FICHIERS
# ============================================

Write-Host "📁 FRONTEND - Nouveaux fichiers:" -ForegroundColor Yellow
Write-Host ""

if (Check-File "apps\web\src\constants\furniture.ts") { $FOUND++ } else { $MISSING++ }
if (Check-File "apps\web\src\utils\aiLayoutConverter.ts") { $FOUND++ } else { $MISSING++ }
if (Check-File "apps\web\src\components\van\FurniturePresets.tsx") { $FOUND++ } else { $MISSING++ }
if (Check-File "apps\web\src\components\van\FurniturePresets.css") { $FOUND++ } else { $MISSING++ }

Write-Host ""
Write-Host "📁 BACKEND - Nouveaux fichiers:" -ForegroundColor Yellow
Write-Host ""

if (Check-File "apps\api\src\ai\guards\ai-pro2-subscription.guard.ts") { $FOUND++ } else { $MISSING++ }

Write-Host ""
Write-Host "📁 DOCUMENTATION:" -ForegroundColor Yellow
Write-Host ""

if (Check-File "DOC_IA\AI_VAN_LAYOUT_CAPABILITIES.md") { $FOUND++ } else { $MISSING++ }
if (Check-File "DOC_IA\SUMMARY_MISSING_ELEMENTS.md") { $FOUND++ } else { $MISSING++ }
if (Check-File "DOC_IA\INTEGRATION_GUIDE.md") { $FOUND++ } else { $MISSING++ }
if (Check-File "DOC_IA\ARCHITECTURE.md") { $FOUND++ } else { $MISSING++ }
if (Check-File "DOC_IA\FILE_MANIFEST.md") { $FOUND++ } else { $MISSING++ }

# ============================================
# FICHIERS MODIFIÉS - VÉRIFICATION APPROFONDIE
# ============================================

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📝 FRONTEND - Fichiers modifiés (vérification du contenu):" -ForegroundColor Yellow
Write-Host ""

# 1. store.ts - Vérifier le champ type
if (Test-Path "apps\web\src\store\store.ts") {
    Write-Host "📄 apps\web\src\store\store.ts" -ForegroundColor Cyan
    if (Check-FileContent "apps\web\src\store\store.ts" "type?:") {
        Write-Host "   ✅ Champ 'type?' trouvé dans FurnitureObject" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Champ 'type?' MANQUANT dans FurnitureObject" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\web\src\store\store.ts NOT FOUND" -ForegroundColor Red
}

# 2. AIAssistant.tsx - Vérifier les imports
Write-Host ""
if (Test-Path "apps\web\src\features\ai\AIAssistant.tsx") {
    Write-Host "📄 apps\web\src\features\ai\AIAssistant.tsx" -ForegroundColor Cyan
    $hasConverter = Check-FileContent "apps\web\src\features\ai\AIAssistant.tsx" "convertAILayoutToFurniture"
    $hasStats = Check-FileContent "apps\web\src\features\ai\AIAssistant.tsx" "calculateLayoutStats"
    
    if ($hasConverter -and $hasStats) {
        Write-Host "   ✅ Imports 'convertAILayoutToFurniture' et 'calculateLayoutStats' trouvés" -ForegroundColor Green
        $MODIFIED++
    } else {
        if (-not $hasConverter) {
            Write-Host "   ⚠️  Import 'convertAILayoutToFurniture' MANQUANT" -ForegroundColor Yellow
        }
        if (-not $hasStats) {
            Write-Host "   ⚠️  Import 'calculateLayoutStats' MANQUANT" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ apps\web\src\features\ai\AIAssistant.tsx NOT FOUND" -ForegroundColor Red
}

# 3. vans.ts - Vérifier dimensions synchronisées
Write-Host ""
if (Test-Path "apps\web\src\constants\vans.ts") {
    Write-Host "📄 apps\web\src\constants\vans.ts" -ForegroundColor Cyan
    # Vérifier si RENAULT_KANGOO a les nouvelles dimensions
    if (Check-FileContent "apps\web\src\constants\vans.ts" "length: 4486") {
        Write-Host "   ✅ Dimensions synchronisées avec le backend (ex: KANGOO 4486)" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Dimensions NON synchronisées (vérifier KANGOO: doit être 4486, pas 4282)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\web\src\constants\vans.ts NOT FOUND" -ForegroundColor Red
}

# 4. VanPlannerLayout.tsx - Vérifier restriction PRO2+
Write-Host ""
if (Test-Path "apps\web\src\components\layout\VanPlannerLayout.tsx") {
    Write-Host "📄 apps\web\src\components\layout\VanPlannerLayout.tsx" -ForegroundColor Cyan
    if (Check-FileContent "apps\web\src\components\layout\VanPlannerLayout.tsx" "isPro2Plus") {
        Write-Host "   ✅ Restriction 'isPro2Plus' trouvée" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Restriction 'isPro2Plus' MANQUANTE (bouton Optimiser accessible à PRO1)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\web\src\components\layout\VanPlannerLayout.tsx NOT FOUND" -ForegroundColor Red
}

# ============================================
# BACKEND - FICHIERS MODIFIÉS
# ============================================

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📝 BACKEND - Fichiers modifiés (vérification du contenu):" -ForegroundColor Yellow
Write-Host ""

# 5. ai.types.ts - Vérifier table et seat
if (Test-Path "apps\api\src\ai\types\ai.types.ts") {
    Write-Host "📄 apps\api\src\ai\types\ai.types.ts" -ForegroundColor Cyan
    $hasTable = Check-FileContent "apps\api\src\ai\types\ai.types.ts" "'table'"
    $hasSeat = Check-FileContent "apps\api\src\ai\types\ai.types.ts" "'seat'"
    
    if ($hasTable -and $hasSeat) {
        Write-Host "   ✅ Types 'table' et 'seat' trouvés" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Types 'table' et/ou 'seat' MANQUANTS" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\api\src\ai\types\ai.types.ts NOT FOUND" -ForegroundColor Red
}

# 6. layout-generator.prompt.ts - Vérifier nouveaux types
Write-Host ""
if (Test-Path "apps\api\src\ai\prompts\layout-generator.prompt.ts") {
    Write-Host "📄 apps\api\src\ai\prompts\layout-generator.prompt.ts" -ForegroundColor Cyan
    $hasTableDesc = Check-FileContent "apps\api\src\ai\prompts\layout-generator.prompt.ts" "table: Table"
    $hasSeatDesc = Check-FileContent "apps\api\src\ai\prompts\layout-generator.prompt.ts" "seat: Siège"
    
    if ($hasTableDesc -and $hasSeatDesc) {
        Write-Host "   ✅ Descriptions 'table' et 'seat' trouvées dans le prompt" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Descriptions 'table' et/ou 'seat' MANQUANTES" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\api\src\ai\prompts\layout-generator.prompt.ts NOT FOUND" -ForegroundColor Red
}

# 7. ai.controller.ts - Vérifier guard PRO2+
Write-Host ""
if (Test-Path "apps\api\src\ai\controllers\ai.controller.ts") {
    Write-Host "📄 apps\api\src\ai\controllers\ai.controller.ts" -ForegroundColor Cyan
    $hasImport = Check-FileContent "apps\api\src\ai\controllers\ai.controller.ts" "AIPro2SubscriptionGuard"
    $hasGuard = Check-FileContent "apps\api\src\ai\controllers\ai.controller.ts" "@UseGuards(AIPro2SubscriptionGuard)"
    
    if ($hasImport -and $hasGuard) {
        Write-Host "   ✅ Guard 'AIPro2SubscriptionGuard' importé et utilisé" -ForegroundColor Green
        $MODIFIED++
    } else {
        if (-not $hasImport) {
            Write-Host "   ⚠️  Import 'AIPro2SubscriptionGuard' MANQUANT" -ForegroundColor Yellow
        }
        if (-not $hasGuard) {
            Write-Host "   ⚠️  Guard '@UseGuards(AIPro2SubscriptionGuard)' MANQUANT sur optimize-plan" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ apps\api\src\ai\controllers\ai.controller.ts NOT FOUND" -ForegroundColor Red
}

# 8. ai.module.ts - Vérifier provider
Write-Host ""
if (Test-Path "apps\api\src\ai\ai.module.ts") {
    Write-Host "📄 apps\api\src\ai\ai.module.ts" -ForegroundColor Cyan
    $hasProvider = Check-FileContent "apps\api\src\ai\ai.module.ts" "AIPro2SubscriptionGuard"
    
    if ($hasProvider) {
        Write-Host "   ✅ Provider 'AIPro2SubscriptionGuard' ajouté" -ForegroundColor Green
        $MODIFIED++
    } else {
        Write-Host "   ⚠️  Provider 'AIPro2SubscriptionGuard' MANQUANT" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ apps\api\src\ai\ai.module.ts NOT FOUND" -ForegroundColor Red
}

# ============================================
# RÉSUMÉ
# ============================================

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Nouveaux fichiers trouvés: $FOUND / 10" -ForegroundColor Green
Write-Host "  ❌ Nouveaux fichiers manquants: $MISSING / 10" -ForegroundColor Red
Write-Host "  📝 Modifications détectées: $MODIFIED / 8" -ForegroundColor Yellow
Write-Host ""

$TOTAL_EXPECTED = 18
$TOTAL_FOUND = $FOUND + $MODIFIED
$PERCENTAGE = [math]::Round(($TOTAL_FOUND / $TOTAL_EXPECTED) * 100, 1)

Write-Host "🎯 Progression globale: $TOTAL_FOUND / $TOTAL_EXPECTED ($PERCENTAGE%)" -ForegroundColor Cyan

if ($PERCENTAGE -eq 100) {
    Write-Host ""
    Write-Host "🎉 PARFAIT ! Tous les fichiers sont présents et correctement modifiés !" -ForegroundColor Green
    Write-Host ""
    exit 0
} elseif ($PERCENTAGE -ge 80) {
    Write-Host ""
    Write-Host "✅ BON ! La plupart des fichiers sont en place. Vérifiez les avertissements ci-dessus." -ForegroundColor Yellow
    Write-Host ""
    exit 0
} else {
    Write-Host ""
    Write-Host "⚠️  ATTENTION ! Plusieurs fichiers manquent ou sont incomplets." -ForegroundColor Red
    Write-Host ""
    exit 1
}
