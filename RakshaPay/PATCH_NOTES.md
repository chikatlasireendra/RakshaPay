# ScamShield Complete Fixes

## Authentication / refresh fixes
- FastAPI is authoritative for login and registration.
- Invalid email/password now returns an error instead of silently creating a local account.
- Stale local-only sessions are no longer treated as authenticated.
- Removed analyzer auto-run on page mount.
- Removed React StrictMode double-mount behavior for the demo build.
- Disabled Vite HMR/file watching for stable hackathon demo navigation; restart Vite after source edits.
- Analyzer results remain visible even if profile-stat synchronization fails.

## Removed
- Shield Mode / Shield Checkpoint.
- Admin UI, admin login, admin dashboard and admin navigation.
- Normal vs Masked report preview/choice. Reports are automatically privacy-masked.
- Google login.

## Theme
- Dark/light theme button is available in the authenticated header.
- Theme choice persists in localStorage.

## Community
- Confirm Threat is guarded once per user in local storage; backend confirmation endpoint also prevents duplicate confirmation for backend reports.
- Community Groups are shown on the right side of Community Reports.
- Groups support shared text discussions, replies, image/video/audio attachments and automated credential moderation.

## Innovations
- Scam DNA and Multi-Evidence Matching are displayed on analyzer results.
- Community Scam Intelligence and Emerging Scam Detection are surfaced in the intelligence area.

## Backend verification
- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/analyze/message`
- `POST /api/analyze/payment`
- `POST /api/analyze/call`
- `GET /api/community/groups`
- `GET /api/community/groups/{group_id}/messages`
- `POST /api/community/groups/{group_id}/messages`
- `POST /api/reports/{report_id}/confirm`

## Windows start
1. Backend: `py -m uvicorn backend.main:app --reload --port 8000`
2. Frontend: `npm install` then `npm run dev`
3. Frontend: `http://localhost:3000`
4. Swagger: `http://127.0.0.1:8000/docs`

Demo account: `demo@scamshield.app` / `Demo@12345`
