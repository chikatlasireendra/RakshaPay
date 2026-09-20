# SCAMSHIELD — Backend Migration Notes

## Preserved

No visual redesign was made. The supplied frontend page files, CSS, React components, assets, navigation presentation, analyzers, dashboard and demo UI remain the baseline.

## Modified frontend plumbing only

- `src/services/apiClient.ts` — new FastAPI HTTP client and bearer-token handling.
- `src/services/authService.ts` — FastAPI auth adapter with local fallback.
- `src/services/scamAnalysisService.ts` — FastAPI message-analysis adapter with local fallback.
- `src/services/paymentAnalysisService.ts` — FastAPI payment-analysis adapter with local fallback.
- `src/services/callAnalysisService.ts` — FastAPI audio upload adapter with local preset fallback.
- `src/pages/CallAnalyzer.tsx` — passes the selected File object to the backend when a real audio file is selected.
- `vite.config.ts` — `/api` proxy to FastAPI.
- `.env.example` — optional `VITE_API_BASE_URL`.
- `package.json` — removed unused Express dependency from the frontend package.

## Preserved local fallback services

- `src/services/authServiceLocal.ts`
- `src/services/scamAnalysisLocal.ts`
- `src/services/paymentAnalysisLocal.ts`
- `src/services/callAnalysisLocal.ts`

## Backend

`backend/` is the Python FastAPI server. It contains auth, analysis, file upload, report, comment, history and intelligence endpoints; optional Gemini and Firestore adapters; and JSON fallback storage.

## Verification performed

- Python backend syntax compilation: passed.
- FastAPI health endpoint: passed.
- Demo login: passed.
- Message analysis: passed; KYC/OTP example returned high risk.
- Payment analysis: passed; ₹25,000 new-recipient collect request returned high risk.

## Current behavior

When FastAPI is running, the supported service adapters use it first. If FastAPI is down, the original local frontend implementation still works so the UI does not break during development.
