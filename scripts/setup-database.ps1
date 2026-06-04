# Jednorázová příprava databáze (PostgreSQL musí běžet)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot + "\.."

$pgBin = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $pgBin)) {
    Write-Host "PostgreSQL 17 nenalezen. Nainstalujte: winget install PostgreSQL.PostgreSQL.17" -ForegroundColor Red
    exit 1
}

Write-Host "Kontroluji PostgreSQL..." -ForegroundColor Cyan
$env:PGPASSWORD = "postgres"
$ok = & $pgBin -U postgres -h 127.0.0.1 -w -tAc "SELECT 1" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nelze se pripojit k PostgreSQL (uzivatel postgres, heslo postgres)." -ForegroundColor Red
    exit 1
}

Write-Host "Vytvarim uzivatele a databazi..." -ForegroundColor Cyan
& $pgBin -U postgres -h 127.0.0.1 -w -f "$PSScriptRoot\setup-database.sql" | Out-Null

Push-Location $PSScriptRoot + "\.."
npm run db:push
npm run db:seed
Pop-Location

Write-Host ""
Write-Host "Hotovo! Spustte aplikaci: npm run dev  nebo  SPUSTIT.bat" -ForegroundColor Green
