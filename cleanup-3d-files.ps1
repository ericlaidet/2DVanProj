# Script PowerShell pour nettoyer les fichiers 3D inutiles
# Emplacement: apps/web/src/assets/Van3DConfig

$vanConfigPath = "c:\02_Coding\02_Projects\2DVanProj\apps\web\src\assets\Van3DConfig"

Write-Host "🗑️  Nettoyage des fichiers 3D inutiles..." -ForegroundColor Cyan
Write-Host ""

# Fichiers à supprimer (inutilisables pour le web)
$filesToDelete = @(
    "4.unitypackage",
    "Mercedes-Benz Sprinter.blend",
    "Mercedes-Benz_Sprinter.usdz",
    "Mercedes Benz_Diffuse.png",
    "Mercedes Benz_Normal.png"
)

# Fichiers optionnels (backups)
$optionalFiles = @(
    "Car (3).fbx",
    "scene.gltf",
    "scene.bin"
)

$totalSize = 0

# Affichage des fichiers à supprimer
Write-Host "📋 Fichiers qui seront SUPPRIMÉS:" -ForegroundColor Yellow
foreach ($file in $filesToDelete) {
    $filePath = Join-Path $vanConfigPath $file
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length / 1MB
        $totalSize += $size
        Write-Host "  ❌ $file ($('{0:N2}' -f $size) MB)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Fichiers optionnels (backups - non supprimés par défaut):" -ForegroundColor Yellow
foreach ($file in $optionalFiles) {
    $filePath = Join-Path $vanConfigPath $file
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length / 1MB
        Write-Host "  ⚠️  $file ($('{0:N2}' -f $size) MB)" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "💾 Espace libéré estimé: $('{0:N2}' -f $totalSize) MB" -ForegroundColor Green
Write-Host ""

# Demande de confirmation
$confirmation = Read-Host "Voulez-vous continuer? (o/n)"

if ($confirmation -eq 'o' -or $confirmation -eq 'O' -or $confirmation -eq 'oui') {
    Write-Host ""
    Write-Host "🚀 Suppression en cours..." -ForegroundColor Cyan
    
    $deletedCount = 0
    foreach ($file in $filesToDelete) {
        $filePath = Join-Path $vanConfigPath $file
        if (Test-Path $filePath) {
            Remove-Item $filePath -Force
            Write-Host "  ✅ Supprimé: $file" -ForegroundColor Green
            $deletedCount++
        } else {
            Write-Host "  ⚠️  Fichier introuvable: $file" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "✨ Nettoyage terminé! $deletedCount fichier(s) supprimé(s)." -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Fichiers conservés:" -ForegroundColor Cyan
    Write-Host "  ✅ mercedes-benz_sprinter.glb (utilisé par le composant)" -ForegroundColor Green
    Write-Host "  ✅ license.txt (informations de licence)" -ForegroundColor Green
    Write-Host ""
    
    # Demande pour supprimer les fichiers optionnels
    Write-Host "Voulez-vous également supprimer les fichiers backups optionnels? (o/n)" -NoNewline
    $optionalConfirmation = Read-Host " "
    
    if ($optionalConfirmation -eq 'o' -or $optionalConfirmation -eq 'O' -or $optionalConfirmation -eq 'oui') {
        Write-Host ""
        foreach ($file in $optionalFiles) {
            $filePath = Join-Path $vanConfigPath $file
            if (Test-Path $filePath) {
                Remove-Item $filePath -Force
                Write-Host "  ✅ Supprimé (backup): $file" -ForegroundColor Green
            }
        }
        Write-Host ""
        Write-Host "✨ Backups supprimés!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "ℹ️  Fichiers backups conservés." -ForegroundColor Blue
    }
} else {
    Write-Host ""
    Write-Host "❌ Opération annulée." -ForegroundColor Red
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
