# find-endpoints.ps1
# Script PowerShell pour trouver tous les endpoints dans votre backend

Write-Host "🔍 Recherche des endpoints dans votre projet..." -ForegroundColor Cyan
Write-Host ""

# Définir le chemin du backend
$backendPath = "apps\backend"

if (-Not (Test-Path $backendPath)) {
    Write-Host "❌ Dossier $backendPath introuvable !" -ForegroundColor Red
    Write-Host "💡 Exécutez ce script depuis la racine de votre monorepo" -ForegroundColor Yellow
    exit
}

Write-Host "📁 Recherche dans: $backendPath" -ForegroundColor Green
Write-Host ""

# 1. Chercher les endpoints Express (app.get, app.post, etc.)
Write-Host "📡 Endpoints Express (app.METHOD):" -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -Include *.ts,*.js | 
    Select-String -Pattern "app\.(get|post|put|delete|patch)" | 
    ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber) → $($_.Line.Trim())" -ForegroundColor White
    }

Write-Host ""

# 2. Chercher les endpoints avec Router
Write-Host "📡 Endpoints avec Router:" -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -Include *.ts,*.js | 
    Select-String -Pattern "router\.(get|post|put|delete|patch)" | 
    ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber) → $($_.Line.Trim())" -ForegroundColor White
    }

Write-Host ""

# 3. Chercher les décorateurs (NestJS, TypeScript) - ÉCHAPPÉ pour PowerShell
Write-Host "📡 Décorateurs de routes (Get, Post, etc.):" -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -Include *.ts | 
    Select-String -Pattern "@Get|@Post|@Put|@Delete|@Patch" | 
    ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber) → $($_.Line.Trim())" -ForegroundColor White
    }

Write-Host ""

# 4. Chercher les fichiers de routes
Write-Host "📂 Fichiers de routes trouvés:" -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -Filter "*route*.ts" | 
    ForEach-Object {
        Write-Host "  📄 $($_.FullName)" -ForegroundColor Cyan
    }

Get-ChildItem -Path $backendPath -Recurse -Filter "*router*.ts" | 
    ForEach-Object {
        Write-Host "  📄 $($_.FullName)" -ForegroundColor Cyan
    }

Write-Host ""

# 5. Chercher aussi les contrôleurs
Write-Host "📂 Fichiers contrôleurs trouvés:" -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -Filter "*controller*.ts" | 
    ForEach-Object {
        Write-Host "  📄 $($_.FullName)" -ForegroundColor Cyan
    }

Write-Host ""

# 6. Résumé des routes par fichier
Write-Host "📊 RÉSUMÉ DES ENDPOINTS:" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray

$totalEndpoints = 0

Get-ChildItem -Path $backendPath -Recurse -Include *.ts,*.js | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    
    # Chercher les patterns de routes
    $patterns = @(
        "router\.get\s*\([`"']([^`"']+)",
        "router\.post\s*\([`"']([^`"']+)",
        "router\.put\s*\([`"']([^`"']+)",
        "router\.delete\s*\([`"']([^`"']+)",
        "router\.patch\s*\([`"']([^`"']+)",
        "app\.get\s*\([`"']([^`"']+)",
        "app\.post\s*\([`"']([^`"']+)",
        "app\.put\s*\([`"']([^`"']+)",
        "app\.delete\s*\([`"']([^`"']+)",
        "app\.patch\s*\([`"']([^`"']+)"
    )
    
    $foundRoutes = @()
    
    foreach ($pattern in $patterns) {
        $matches = [regex]::Matches($content, $pattern)
        foreach ($match in $matches) {
            $method = if ($pattern -match "\.get") { "GET" }
                     elseif ($pattern -match "\.post") { "POST" }
                     elseif ($pattern -match "\.put") { "PUT" }
                     elseif ($pattern -match "\.delete") { "DELETE" }
                     elseif ($pattern -match "\.patch") { "PATCH" }
            
            $path = $match.Groups[1].Value
            $foundRoutes += [PSCustomObject]@{
                Method = $method
                Path = $path
            }
            $totalEndpoints++
        }
    }
    
    if ($foundRoutes.Count -gt 0) {
        Write-Host ""
        Write-Host "📄 $($file.Name)" -ForegroundColor Cyan
        Write-Host "   Chemin: $($file.FullName)" -ForegroundColor DarkGray
        foreach ($route in $foundRoutes) {
            $methodColor = switch ($route.Method) {
                "GET" { "Green" }
                "POST" { "Blue" }
                "PUT" { "Yellow" }
                "DELETE" { "Red" }
                "PATCH" { "Magenta" }
            }
            Write-Host "   " -NoNewline
            Write-Host "$($route.Method.PadRight(7))" -NoNewline -ForegroundColor $methodColor
            Write-Host " $($route.Path)" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "✅ Recherche terminée ! Total: $totalEndpoints endpoints trouvés" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Astuce: Pour plus de détails, ouvrez les fichiers dans VS Code" -ForegroundColor Yellow
