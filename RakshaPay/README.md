# SCAMSHIELD — Complete Working Project

SCAMSHIELD keeps the supplied React/Vite frontend and connects it to a Python FastAPI backend.

## Stack
- Frontend: React + Vite (existing UI preserved)
- Backend: Python 3 + FastAPI
- AI: Gemini through FastAPI only
- Database: local JSON demo store by default; optional Firebase Firestore
- Storage: local `uploads/` in demo mode; optional Firebase Storage hooks

## Important
The existing frontend was intentionally preserved as closely as possible. The backend was changed to FastAPI and the analyzer/auth flows were connected through `/api/*`.

## Windows — easiest way
You need Node.js and Python. The `py` launcher is supported, so you do NOT need to fix the `python` command first.

### Option A: one click-style batch launch
1. Open this folder in File Explorer.
2. Double-click `start_all.bat`.
3. Two terminal windows will open.
4. Open http://localhost:3000

### Option B: manual
Backend terminal:
```powershell
py -m venv venv
venv\\Scripts\\python.exe -m pip install -r backend\\requirements.txt
venv\\Scripts\\python.exe -m uvicorn backend.main:app --reload --port 8000
```

Frontend terminal:
```powershell
npm install
npm run dev
```

Open:
http://localhost:3000

Backend health:
http://127.0.0.1:8000/api/health

## Demo account
Email: `demo@scamshield.app`
Password: `Demo@12345`

## Gemini
The app runs in deterministic local fallback mode when no Gemini key is configured. To use Gemini, put your key in `.env`:
```env
GEMINI_API_KEY=YOUR_KEY_HERE
GEMINI_MODEL=gemini-3.8-flash
```
The Gemini key is read by the Python backend and is not exposed to the browser.

## Firebase / Firestore (optional)
Demo mode works without Firebase. For deployment, configure:
```env
FIRESTORE_ENABLED=true
GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\serviceAccount.json
```

## File uploads
Call Analyzer accepts MP3/WAV/M4A/OGG. The backend enforces a configurable maximum upload size (`MAX_UPLOAD_MB`, default 25).

## Architecture
Browser → Vite/React → `/api/*` proxy → FastAPI → analysis / storage / optional Gemini / optional Firestore.

## Notes
- The project does not require the original Node/Express backend.
- Keep the terminal running while using the app.
- Do not commit `.env` or Firebase service-account files.
