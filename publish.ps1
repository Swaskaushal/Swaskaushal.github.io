# ============================================================
#  publish.ps1  —  one-click website update
#  Usage:  ./publish.ps1 "your commit message"
# ============================================================
param(
    [string]$Message = "Update portfolio content"
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

# Validate all data JSON files before publishing
Write-Host "Validating data files..." -ForegroundColor Cyan
$bad = $false
Get-ChildItem -Path "data" -Filter *.json | ForEach-Object {
    try {
        Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null
        Write-Host ("  OK  " + $_.Name) -ForegroundColor Green
    } catch {
        Write-Host ("  BAD " + $_.Name + "  -> " + $_.Exception.Message) -ForegroundColor Red
        $bad = $true
    }
}
if ($bad) { Write-Host "Fix the JSON errors above, then run again." -ForegroundColor Red; exit 1 }

# Commit & push
git add .
$changes = git status --porcelain
if (-not $changes) { Write-Host "Nothing to publish — everything is up to date." -ForegroundColor Yellow; exit 0 }

git commit -m $Message
git push origin main
Write-Host "`nPublished! Your site will refresh at https://swaskaushal.github.io in a minute." -ForegroundColor Green
