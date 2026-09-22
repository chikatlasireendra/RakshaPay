from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import APP_NAME, HOST, PORT
from .routes.api import router

app = FastAPI(title=APP_NAME, version="1.0.0")
app.add_middleware(
    CORSMiddleware,

  allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://raksha-fx3wjafwu-raksha-pay.vercel.app",
    "https://raksha-pay-raksha-pay.vercel.app"
],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
UPLOADS = ROOT / "uploads"
UPLOADS.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS), name="uploads")

if DIST.exists():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="frontend")

@app.get("/")
def root():
    if DIST.exists():
        from fastapi.responses import FileResponse
        return FileResponse(DIST / "index.html")
    return {"service": APP_NAME, "message": "Frontend is running through Vite. Start it with npm run dev."}
