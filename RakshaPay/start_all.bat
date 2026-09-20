@echo off
setlocal
cd /d "%~dp0"
start "RakshaPay Backend" cmd /k "cd /d \"%~dp0\" && call start_backend.bat"
timeout /t 3 /nobreak >nul
start "RakshaPay Frontend" cmd /k "cd /d \"%~dp0\" && call start_frontend.bat"
echo RakshaPay is starting.
echo Frontend: http://localhost:3000
echo Backend:  http://127.0.0.1:8000/api/health
