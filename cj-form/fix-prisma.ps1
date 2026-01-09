# PowerShell script to fix Prisma permission errors on Windows
# Run this script as Administrator if needed

Write-Host "Fixing Prisma permission errors..." -ForegroundColor Yellow

# Step 1: Kill any Node processes that might be locking the file
Write-Host "`nStep 1: Stopping Node processes..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Remove the problematic .prisma folder
Write-Host "`nStep 2: Removing .prisma folder..." -ForegroundColor Cyan
$prismaPath = Join-Path $PSScriptRoot "node_modules\.prisma"
if (Test-Path $prismaPath) {
    Remove-Item -Path $prismaPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Removed .prisma folder" -ForegroundColor Green
} else {
    Write-Host ".prisma folder not found" -ForegroundColor Yellow
}

# Step 3: Regenerate Prisma client
Write-Host "`nStep 3: Regenerating Prisma client..." -ForegroundColor Cyan
Set-Location $PSScriptRoot
npx prisma generate

Write-Host "`nDone! Try running 'shopify app dev' again." -ForegroundColor Green
