@echo off
setlocal
cd /d "%~dp0"
if not exist "venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  py -m venv venv
  if errorlevel 1 (
    echo Failed to create virtual environment. Make sure Python/py is installed.
    pause
    exit /b 1
  )
)
echo Installing/updating backend dependencies...
venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if errorlevel 1 (
  echo Backend dependency installation failed.
  pause
  exit /b 1
)
echo Starting RakshaPay FastAPI backend on http://127.0.0.1:8000
venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
pause
