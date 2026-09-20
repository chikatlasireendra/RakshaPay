from typing import Any

from ..config import FIRESTORE_ENABLED, GOOGLE_APPLICATION_CREDENTIALS

_db = None


def firestore_enabled() -> bool:
    return FIRESTORE_ENABLED and bool(GOOGLE_APPLICATION_CREDENTIALS)


def get_db():
    global _db
    if _db is not None:
        return _db
    if not firestore_enabled():
        return None
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        if not firebase_admin._apps:
            cred = credentials.Certificate(GOOGLE_APPLICATION_CREDENTIALS)
            firebase_admin.initialize_app(cred)
        _db = firestore.client()
        return _db
    except Exception:
        return None


def collection_items(name: str) -> list[dict[str, Any]]:
    db = get_db()
    if db is None:
        return []
    return [{"id": doc.id, **doc.to_dict()} for doc in db.collection(name).stream()]


def find_by_field(name: str, field: str, value: Any):
    db = get_db()
    if db is None:
        return None
    docs = db.collection(name).where(field, "==", value).limit(1).stream()
    for doc in docs:
        return {"id": doc.id, **doc.to_dict()}
    return None


def upsert(name: str, item: dict[str, Any], item_id: str | None = None):
    db = get_db()
    if db is None:
        return item
    clean = dict(item)
    doc_id = item_id or clean.get("id")
    if not doc_id:
        raise ValueError("Firestore item requires an id")
    clean.pop("id", None)
    db.collection(name).document(doc_id).set(clean, merge=True)
    return {"id": doc_id, **clean}


def delete(name: str, item_id: str):
    db = get_db()
    if db is not None:
        db.collection(name).document(item_id).delete()
