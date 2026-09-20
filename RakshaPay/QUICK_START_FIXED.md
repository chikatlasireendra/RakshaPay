# ScamShield — Fixed Final Build

## 1. Backend
Open PowerShell in this folder:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
py -m pip install -r backend\requirements.txt
py -m uvicorn backend.main:app --reload --port 8000
```

If PowerShell blocks activation, use the venv without activating:

```powershell
py -m pip install -r backend\requirements.txt
py -m uvicorn backend.main:app --reload --port 8000
```

## 2. Frontend
Open a second PowerShell in the same folder:

```powershell
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

## Demo login
Email: demo@scamshield.app
Password: Demo@12345

Invalid credentials are rejected by the FastAPI backend; the frontend no longer creates a session locally.

## Important fixes in this build
- Fixed blank/white page caused by missing `SAMPLE_SCENARIOS` export.
- Added frontend error boundary so runtime errors are visible instead of a blank page.
- Fixed suspicious message detection for coercive payment + card-blocking messages.
- Fixed payment analyzer handling of collect-request labels.
- Removed duplicate reporter object key.
- Added favicon to remove the browser 404.
- Kept automatic PII masking; no Normal/Masked submission choice.
- No admin login/dashboard and no Shield Mode route is required by the fixed core flow.
- Dark/light theme remains persistent with localStorage.
