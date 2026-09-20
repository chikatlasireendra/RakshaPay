@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules" (
  echo Installing frontend dependencies...
  npm install --legacy-peer-deps
  if errorlevel 1 (
    echo Frontend dependency installation failed.
    pause
    exit /b 1
  )
)
echo Starting RakshaPay frontend on http://localhost:3000
npm run dev
pause
