from pathlib import Path
import os
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

APP_NAME = "SCAMSHIELD API"
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "").strip()
FIRESTORE_ENABLED = os.getenv("FIRESTORE_ENABLED", "false").strip().lower() == "true"
MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "25"))
DATA_DIR = ROOT / "backend" / "data"
UPLOAD_DIR = ROOT / "uploads"
SESSION_FILE = DATA_DIR / "sessions.json"
USERS_FILE = DATA_DIR / "users.json"
REPORTS_FILE = DATA_DIR / "reports.json"
HISTORY_FILE = DATA_DIR / "history.json"
COMMENTS_FILE = DATA_DIR / "comments.json"
NOTIFICATIONS_FILE = DATA_DIR / "notifications.json"
GROUPS_FILE = DATA_DIR / "groups.json"
GROUP_MESSAGES_FILE = DATA_DIR / "group_messages.json"

for path in (DATA_DIR, UPLOAD_DIR):
    path.mkdir(parents=True, exist_ok=True)
