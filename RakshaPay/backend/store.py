import json
import uuid
from datetime import datetime, timezone
from threading import Lock
from typing import Any

from .config import (
    USERS_FILE, REPORTS_FILE, HISTORY_FILE, COMMENTS_FILE, NOTIFICATIONS_FILE, GROUPS_FILE, GROUP_MESSAGES_FILE,
)
from .firebase.firestore import firestore_enabled, collection_items, find_by_field, upsert

_lock = Lock()


def _read(path):
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []


def _write(path, value):
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LocalStore:
    def _items(self, file): return _read(file)

    def _firestore_items(self, collection, file):
        if firestore_enabled():
            return collection_items(collection)
        return _read(file)

    def users(self): return self._firestore_items("users", USERS_FILE)
    def reports(self): return self._firestore_items("reports", REPORTS_FILE)
    def history(self): return self._firestore_items("analysis_history", HISTORY_FILE)
    def comments(self): return self._firestore_items("comments", COMMENTS_FILE)
    def notifications(self): return self._firestore_items("notifications", NOTIFICATIONS_FILE)
    def groups(self): return _read(GROUPS_FILE)
    def group_messages(self): return _read(GROUP_MESSAGES_FILE)

    def find_user_by_email(self, email: str):
        if firestore_enabled(): return find_by_field("users", "email", email.lower().strip())
        return next((x for x in self.users() if x.get("email", "").lower() == email.lower().strip()), None)

    def find_user(self, user_id: str):
        if firestore_enabled():
            from .firebase.firestore import get_db
            db = get_db()
            if db is not None:
                doc = db.collection("users").document(user_id).get()
                return {"id": doc.id, **doc.to_dict()} if doc.exists else None
        return next((x for x in self.users() if x.get("id") == user_id), None)

    def save_user(self, user: dict):
        if firestore_enabled(): return upsert("users", user, user.get("id"))
        with _lock:
            items = self.users()
            found = next((i for i, x in enumerate(items) if x.get("id") == user.get("id")), None)
            if found is None: items.append(user)
            else: items[found] = user
            _write(USERS_FILE, items)
        return user

    def save_report(self, report: dict):
        if firestore_enabled(): return upsert("reports", report, report.get("id"))
        with _lock:
            items = self.reports()
            found = next((i for i, x in enumerate(items) if x.get("id") == report.get("id")), None)
            if found is None: items.insert(0, report)
            else: items[found] = report
            _write(REPORTS_FILE, items)
        return report

    def save_history(self, item: dict):
        item = dict(item)
        item.setdefault("id", f"history-{uuid.uuid4().hex[:12]}")
        if firestore_enabled(): return upsert("analysis_history", item, item.get("id"))
        with _lock:
            items = self.history(); items.insert(0, item); _write(HISTORY_FILE, items)
        return item

    def save_comment(self, item: dict):
        if firestore_enabled(): return upsert("comments", item, item.get("id"))
        with _lock:
            items = self.comments(); items.insert(0, item); _write(COMMENTS_FILE, items)
        return item

    def save_group(self, item: dict):
        with _lock:
            items = self.groups(); found = next((i for i, x in enumerate(items) if x.get('id') == item.get('id')), None)
            if found is None: items.append(item)
            else: items[found] = item
            _write(GROUPS_FILE, items)
        return item

    def save_group_message(self, item: dict):
        with _lock:
            items = self.group_messages(); items.append(item); _write(GROUP_MESSAGES_FILE, items)
        return item

    def add_notification(self, item: dict):
        if firestore_enabled(): return upsert("notifications", item, item.get("id"))
        with _lock:
            items = self.notifications(); items.insert(0, item); _write(NOTIFICATIONS_FILE, items)
        return item

    def mark_notifications_read(self, user_id: str):
        if firestore_enabled():
            from .firebase.firestore import get_db
            db = get_db()
            if db is not None:
                for item in self.notifications():
                    if item.get("userId") == user_id:
                        db.collection("notifications").document(item["id"]).set({"unread": False}, merge=True)
            return
        with _lock:
            items = self.notifications()
            for item in items:
                if item.get("userId") == user_id:
                    item["unread"] = False
            _write(NOTIFICATIONS_FILE, items)


store = LocalStore()
