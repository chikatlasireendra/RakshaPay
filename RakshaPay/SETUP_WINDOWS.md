# SCAMSHIELD — Windows Setup

## Recommended
Double-click `start_all.bat`.

It creates the Python virtual environment, installs FastAPI dependencies, starts the backend, installs npm packages if needed, and starts Vite.

Then open:
`http://localhost:3000`

## Manual commands
Backend:
```powershell
py -m venv venv
venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt
venv\\Scripts\\python.exe -m uvicorn backend.main:app --reload --port 8000
```

Frontend (new terminal):
```powershell
npm install
npm run dev
```

## Demo login
`demo@scamshield.app` / `Demo@12345`

## First checks
1. http://127.0.0.1:8000/api/health should return `{"ok":true,...}`
2. http://localhost:3000 should load the original SCAMSHIELD UI.
3. Login with the demo account.
4. Try Message Analyzer and Payment Analyzer.
5. Try Call Analyzer with an MP3/WAV/M4A/OGG file.
