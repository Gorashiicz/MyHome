@echo off
chcp 65001 >nul
cd /d "%~dp0.."

echo ========================================
echo   Stavba Pod Kontrolou
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo CHYBA: Node.js neni nainstalovany.
  echo Stahnete z https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instaluji zavislosti...
  call npm install
  if errorlevel 1 goto :error
)

if not exist .env (
  echo Vytvarim .env z .env.example...
  copy .env.example .env >nul
  echo DOLEZITE: Upravte AUTH_SECRET v souboru .env
)

echo Kontroluji PostgreSQL...
sc query postgresql-x64-17 | find "RUNNING" >nul
if errorlevel 1 (
  echo VAROVANI: Sluzba PostgreSQL nebezi. Spuste sluzbu postgresql-x64-17
  echo          nebo: services.msc
  echo.
)

echo Spoustim vyvojovy server...
echo.
echo   Aplikace:  http://localhost:3000
echo   Demo:      demo@stavba.cz / demo1234
echo.
echo   Zmeny v kodu se projevi automaticky.
echo   Ukonceni:  Ctrl+C v tomto okne
echo.

call npm run dev
goto :eof

:error
echo.
echo Spusteni selhalo. Zkuste v kořeni projektu: npm run setup
pause
exit /b 1
