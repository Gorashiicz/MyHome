@echo off
chcp 65001 >nul
echo ========================================
echo  Stavba Pod Kontrolou — nasazeni na web
echo ========================================
echo.
echo Kompletni navod: docs\NASAZENI.md
echo.
echo Rychle kontroly:
echo   1. GitHub repozitar (viz navod krok 1)
echo   2. Neon DATABASE_URL
echo   3. Supabase Storage
echo   4. Vercel deploy
echo.
echo Uzitecne prikazy:
echo   npm run auth:secret          — novy AUTH_SECRET
echo   npm run setup:cloud-db       — schema na Neon
echo   npm run setup:cloud-db -- --seed
echo   npm run setup:supabase-bucket
echo.
pause
