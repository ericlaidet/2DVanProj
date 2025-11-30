@echo off
REM Script de verification des fichiers IA - VanPlanner
REM Usage: verify-ia-files.bat

echo.
echo Verification des fichiers IA...
echo ========================================
echo.

set FOUND=0
set MISSING=0

echo [Frontend - Nouveaux fichiers]
call :check_file "apps\web\src\constants\furniture.ts"
call :check_file "apps\web\src\utils\aiLayoutConverter.ts"
call :check_file "apps\web\src\components\van\FurniturePresets.tsx"
call :check_file "apps\web\src\components\van\FurniturePresets.css"

echo.
echo [Backend - Nouveaux fichiers]
call :check_file "apps\api\src\ai\guards\ai-pro2-subscription.guard.ts"

echo.
echo [Documentation]
call :check_file "DOC_IA\AI_VAN_LAYOUT_CAPABILITIES.md"
call :check_file "DOC_IA\SUMMARY_MISSING_ELEMENTS.md"
call :check_file "DOC_IA\INTEGRATION_GUIDE.md"
call :check_file "DOC_IA\ARCHITECTURE.md"
call :check_file "DOC_IA\FILE_MANIFEST.md"

echo.
echo [Fichiers modifies - Verification manuelle requise]
call :check_file "apps\web\src\store\store.ts"
call :check_file "apps\web\src\features\ai\AIAssistant.tsx"
call :check_file "apps\web\src\constants\vans.ts"
call :check_file "apps\web\src\components\layout\VanPlannerLayout.tsx"
call :check_file "apps\api\src\ai\types\ai.types.ts"
call :check_file "apps\api\src\ai\prompts\layout-generator.prompt.ts"
call :check_file "apps\api\src\ai\controllers\ai.controller.ts"
call :check_file "apps\api\src\ai\ai.module.ts"

echo.
echo ========================================
echo RESUME:
echo   Fichiers trouves: %FOUND%
echo   Fichiers manquants: %MISSING%
echo ========================================
echo.

if %MISSING% EQU 0 (
    echo [OK] Tous les fichiers sont presents!
    echo.
    echo ATTENTION: Verifiez manuellement le CONTENU des fichiers modifies:
    echo   - store.ts: Champ type? ajoute?
    echo   - AIAssistant.tsx: Imports convertAILayoutToFurniture?
    echo   - vans.ts: Dimensions synchronisees avec backend?
    echo   - VanPlannerLayout.tsx: Restriction isPro2Plus ajoutee?
    echo   - ai.controller.ts: Guard AIPro2SubscriptionGuard utilise?
    echo   - ai.module.ts: Provider AIPro2SubscriptionGuard ajoute?
    exit /b 0
) else (
    echo [ERREUR] %MISSING% fichier(s) manquant(s) !
    echo.
    echo Action requise: Creez les fichiers manquants.
    exit /b 1
)

:check_file
if exist %~1 (
    echo [OK] %~1
    set /a FOUND+=1
) else (
    echo [MANQUANT] %~1
    set /a MISSING+=1
)
exit /b
