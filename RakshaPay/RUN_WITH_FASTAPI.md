# SCAMSHIELD — Same Frontend + Python FastAPI Backend

## What changed

The React/Vite frontend from the supplied ZIP was kept as the UI baseline. Page JSX, Tailwind styling, components, icons, layouts, and mock/demo presentation were not visually redesigned.

Only the integration/backend plumbing was changed:

- Added `backend/` with Python 3 + FastAPI.
- Added `/api/auth/*`, `/api/analyze/message`, `/api/analyze/payment`, `/api/analyze/call`, report/comment/history/intelligence endpoints.
- Added optional Gemini integration in the FastAPI backend only.
- Added optional Firestore integration with local JSON fallback.
- Added an API client under `src/services/apiClient.ts`.
- Message, payment, call, and auth services now try FastAPI first and fall back to the original local implementation if the backend is unavailable.
- Added Vite `/api` proxy to `http://127.0.0.1:8000`.
- The original frontend service implementations are preserved as `*Local.ts` fallback files.

## Run backend

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
py -m pip install -r backend/requirements.txt
py -m uvicorn backend.main:app --reload --port 8000
```

Backend health check:

`http://127.0.0.1:8000/api/health`

## Run frontend

Open a second terminal in the project folder:

```powershell
npm install
npm run dev
```

Open:

`http://localhost:3000`

The Vite proxy sends `/api/*` requests to FastAPI.

## Demo login

- Email: `demo@scamshield.app`
- Password: `Demo@12345`

## Optional Gemini

Put the Gemini API key in the root `.env` as `GEMINI_API_KEY=...`.
The frontend never receives the Gemini key.

## Optional Firestore

Set:

```text
FIRESTORE_ENABLED=true
GOOGLE_APPLICATION_CREDENTIALS=C:\\path\\to\\service-account.json
```

Without those settings the project uses its local JSON demo store.

## Important note

This version intentionally preserves the supplied React/Vite frontend. Converting the UI to HTML/CSS/Vanilla JS would be a separate frontend rewrite and would not keep the supplied frontend unchanged.
