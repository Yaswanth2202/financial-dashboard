@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo.
echo [install-dependencies] Finance Dashboard - installing npm packages...
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not on PATH.
  echo Install Node.js 18+ from https://nodejs.org/ then run this file again.
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm was not found. Reinstall Node.js or fix your PATH.
  exit /b 1
)

call npm install
if errorlevel 1 (
  echo.
  echo ERROR: npm install failed.
  exit /b 1
)

echo.
echo [install-dependencies] Done. Run: npm run dev
echo.
exit /b 0
