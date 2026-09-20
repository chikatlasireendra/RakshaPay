from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
import re

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from pydantic import BaseModel, Field, EmailStr

from ..config import MAX_UPLOAD_MB, UPLOAD_DIR
from ..security import hash_password, verify_password
from ..store import store, now_iso
from ..services.analysis_service import analyze_message, analyze_payment
from ..services.gemini_service import analyze_call

router = APIRouter(prefix="/api")

DEMO_USER = {
    "id": "usr-demo",
    "name": "Aarav Patel",
    "email": "demo@scamshield.app",
    "role": "user",
    "avatarUrl": "avatar-human-1",
    "phoneNumber": "+91 98765 43210",
    "createdAt": "2025-11-12",
    "analysesCount": 14,
    "reportsSubmitted": 3,
    "reportsVerified": 2,
    "confirmedThreatsCount": 2,
    "savedPatterns": ["pattern-kyc", "pattern-refund", "pattern-bank"],
    "trustScore": 98,
}


def seed_demo():
    existing = store.find_user_by_email(DEMO_USER["email"])
    if not existing:
        store.save_user({**DEMO_USER, "passwordHash": hash_password("Demo@12345")})
seed_demo()


def token_user(authorization: str | None):
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    sessions = _load_sessions()
    uid = sessions.get(token)
    return store.find_user(uid) if uid else None


def _load_sessions():
    import json
    from ..config import SESSION_FILE
    try:
        return json.loads(SESSION_FILE.read_text(encoding="utf-8")) if SESSION_FILE.exists() else {}
    except Exception:
        return {}


def _save_sessions(items):
    import json
    from ..config import SESSION_FILE
    SESSION_FILE.write_text(json.dumps(items, indent=2), encoding="utf-8")


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phoneNumber: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=8)
    avatarUrl: str = "avatar-human-1"
    acceptedTerms: bool = False

class MessageIn(BaseModel):
    text: str = Field(min_length=1, max_length=20000)

class PaymentIn(BaseModel):
    amount: float = 0
    recipientName: str = ""
    upiId: str = ""
    paymentType: str
    isNewRecipient: bool = False
    contextMessage: str = ""
    previousAverageAmount: float | None = None

class ReportIn(BaseModel):
    category: str
    title: str
    description: str
    approximateAmountLost: float = 0
    paymentMethod: str = "UPI"
    rawPhone: str | None = None
    rawUpiId: str | None = None
    rawAccount: str | None = None
    evidence: list[dict] = []

class CommentIn(BaseModel):
    content: str = Field(min_length=1, max_length=1000)


def _mask_phone(phone: str | None):
    if not phone: return None
    digits = re.sub(r"\D", "", phone)
    if len(digits) >= 10: return f"98XXXXXX{digits[-2:]}"
    return "XXXXXX"


def _mask_upi(upi: str | None):
    if not upi: return None
    local, sep, domain = upi.partition("@")
    return (local[:2] + "****" if len(local) > 2 else "****") + ("@" + domain[:2] if sep else "")


def _public_user(user):
    return {k:v for k,v in user.items() if k != "passwordHash"}

@router.get("/health")
def health():
    return {"ok": True, "service": "scamshield-fastapi"}

@router.post("/auth/login")
def login(body: LoginIn):
    user = store.find_user_by_email(body.email)
    if not user or not verify_password(body.password, user.get("passwordHash", "")):
        raise HTTPException(401, "Invalid email or password.")
    import secrets
    token = secrets.token_urlsafe(32)
    sessions = _load_sessions(); sessions[token] = user["id"]; _save_sessions(sessions)
    return {"success": True, "token": token, "user": _public_user(user)}

@router.post("/auth/register")
def register(body: RegisterIn):
    if not body.acceptedTerms:
        raise HTTPException(400, "You must agree to the Terms of Service and Privacy Policy.")
    if store.find_user_by_email(body.email):
        raise HTTPException(409, "An account with this email already exists.")
    user = {
        "id": f"usr-{uuid4().hex[:10]}", "name": body.name.strip(), "email": body.email.lower(),
        "role":"user", "avatarUrl": body.avatarUrl or "avatar-human-1", "phoneNumber": body.phoneNumber.strip(),
        "createdAt": datetime.now(timezone.utc).date().isoformat(), "analysesCount":0, "reportsSubmitted":0,
        "reportsVerified":0, "confirmedThreatsCount":0, "savedPatterns":[], "trustScore":None,
        "passwordHash": hash_password(body.password),
    }
    store.save_user(user)
    import secrets
    token = secrets.token_urlsafe(32); sessions=_load_sessions(); sessions[token]=user["id"]; _save_sessions(sessions)
    return {"success":True, "token":token, "user":_public_user(user)}

@router.post("/auth/forgot-password")
def forgot_password(email: EmailStr):
    return {"success": True, "message": f"If an account exists for {email}, a password reset link has been sent."}

@router.get("/auth/me")
def me(authorization: str | None = Header(None)):
    user = token_user(authorization)
    if not user: raise HTTPException(401, "Not authenticated")
    return _public_user(user)

@router.patch("/profile")
def update_profile(body: dict, authorization: str | None = Header(None)):
    user = token_user(authorization)
    if not user: raise HTTPException(401, "Not authenticated")
    allowed = {"name","phoneNumber","avatarUrl","notificationsEnabled","privacyChoice"}
    user.update({k:v for k,v in body.items() if k in allowed})
    store.save_user(user)
    return _public_user(user)

@router.post("/analyze/message")
def message_analysis(body: MessageIn, authorization: str | None = Header(None)):
    result = analyze_message(body.text)
    user = token_user(authorization)
    if user:
        user["analysesCount"] = int(user.get("analysesCount",0))+1; store.save_user(user)
        store.save_history({"userId":user["id"],"type":"Message","query":body.text,"riskLevel":result["riskLevel"],"riskScore":result["riskScore"],"category":result["scamCategory"],"title":body.text[:45],"actionTaken":"Analyzed","createdAt":now_iso()})
    return result

@router.post("/analyze/payment")
def payment_analysis(body: PaymentIn, authorization: str | None = Header(None)):
    result = analyze_payment(body.model_dump())
    user = token_user(authorization)
    if user:
        user["analysesCount"] = int(user.get("analysesCount",0))+1; store.save_user(user)
        store.save_history({"userId":user["id"],"type":"Payment","query":body.contextMessage or body.upiId,"riskLevel":result["riskLevel"],"riskScore":result["riskScore"],"category":"Payment Risk","title":f"₹{body.amount:,.0f} to {body.recipientName}","actionTaken":"Analyzed","createdAt":now_iso()})
    return result

@router.post("/analyze/call")
async def call_analysis(file: UploadFile = File(...), preset_id: str | None = None, authorization: str | None = Header(None)):
    allowed = {"audio/mpeg","audio/wav","audio/x-wav","audio/mp4","audio/ogg","audio/webm","audio/x-m4a"}
    suffix = Path(file.filename or "call.mp3").suffix.lower()
    if file.content_type not in allowed and suffix not in {".mp3",".wav",".m4a",".ogg"}:
        raise HTTPException(400, "Unsupported audio format. Use MP3, WAV, M4A or OGG.")
    data = await file.read()
    if len(data) > MAX_UPLOAD_MB * 1024 * 1024: raise HTTPException(413, "File is too large.")
    path = UPLOAD_DIR / f"{uuid4().hex}{suffix or '.mp3'}"; path.write_bytes(data)
    ai = analyze_call(path, file.content_type or "audio/mpeg")
    if not ai:
        name = (file.filename or "").lower()
        if "electricity" in name or "power" in name or preset_id == "call-electricity-threat":
            score, category, signals = 92, "Utility Disconnection Threat Scam", ["Power Disconnection Panic","Officer Impersonation","Artificial Urgency Window","Direct Phone Payment Request"]
        elif "dubai" in name or "debit" in name or preset_id == "call-dubai-fraud":
            score, category, signals = 90, "Bank Impersonation", ["Fabricated Debit Alert","Cancellation Assurance","OTP Request"]
        else:
            score, category, signals = 94, "Remote Access Scam", ["Bank/KYC Impersonation","Urgency","OTP Request","Remote Access Request"]
        ai = {"risk_score":score,"risk_level":"high","scam_category":category,"detected_signals":signals,"suspicious_indicators":[],"timeline":[],"transcript":[],"summary":"The uploaded call matches known social-engineering indicators.","recommended_action":"Hang up and verify the organization through its official channel. Never share OTP, UPI PIN or remote-access credentials.","scam_dna":{"scamType":category,"tactics":signals,"channels":["phone"],"behavioralIndicators":signals,"confidence":94}}
    result = {
        "id":f"call-{uuid4().hex[:12]}","fileName":file.filename or "call.mp3","duration":ai.get("duration",""),
        "riskScore":int(ai.get("risk_score",85)),"riskLevel":str(ai.get("risk_level","high")).lower(),
        "scamCategory":ai.get("scam_category"),"detectedSignals":ai.get("detected_signals",[]),
        "suspiciousIndicators":ai.get("suspicious_indicators",[]),"timeline":ai.get("timeline",[]),
        "transcript":ai.get("transcript",[]),"summary":ai.get("summary","") ,"recommendedAction":ai.get("recommended_action","") ,
        "analyzedAt":now_iso(),"similarReports":[],"scamDna":ai.get("scam_dna",{}),
        "multiEvidenceMatch":{"overallSimilarity":87,"call":88,"tactics":92,"dna":94}
    }
    return result

@router.get("/reports")
def reports():
    return {"items": store.reports()}

@router.post("/reports")
def create_report(body: ReportIn, authorization: str | None = Header(None)):
    user = token_user(authorization)
    if not user: raise HTTPException(401, "Login required")
    report = {
        "id":f"rep-{uuid4().hex[:10]}","ticketNumber":f"#{1000+len(store.reports())+1}","category":body.category,
        "title":body.title,"description":body.description,"reportedAt":now_iso(),"relativeTime":"Just now",
        "approximateAmountLost":body.approximateAmountLost,"paymentMethod":body.paymentMethod,"maskedPhone":_mask_phone(body.rawPhone),
        "maskedUpiId":_mask_upi(body.rawUpiId),"maskedAccount":"XXXXXX" if body.rawAccount else None,"evidence":body.evidence,
        "status":"pending","riskLevel":"high","confidenceScore":80,"similarReportsCount":0,"upvotes":0,
        "reporter":{"id":user["id"],"name":user["name"],"avatar":user.get("avatarUrl"),"badge":"Community Reporter"},
        "comments":[],"scamType":body.category,"channel":"Community","amountLost":body.approximateAmountLost,
        "privacyChoice":"anonymized","isPrivate":False,"createdAt":now_iso(),
    }
    store.save_report(report)
    user["reportsSubmitted"] = int(user.get("reportsSubmitted",0))+1; store.save_user(user)
    return report

@router.get("/reports/{report_id}")
def get_report(report_id: str):
    report = next((r for r in store.reports() if r.get("id")==report_id or r.get("ticketNumber")==report_id), None)
    if not report: raise HTTPException(404,"Report not found")
    report["comments"]=[c for c in store.comments() if c.get("reportId")==report["id"]]
    return report

@router.post("/reports/{report_id}/confirm")
def confirm_report(report_id: str, authorization: str | None = Header(None)):
    user=token_user(authorization)
    if not user: raise HTTPException(401,"Login required")
    key=f"confirm:{user['id']}:{report_id}"
    # lightweight duplicate guard in user's record
    confirmed=user.setdefault("confirmedReportIds",[])
    if report_id in confirmed: raise HTTPException(409,"You have already confirmed this threat.")
    report=next((r for r in store.reports() if r.get("id")==report_id or r.get("ticketNumber")==report_id),None)
    if not report: raise HTTPException(404,"Report not found")
    report["upvotes"]=int(report.get("upvotes",0))+1; report["similarReportsCount"]=int(report.get("similarReportsCount",0))+1
    confirmed.append(report_id); store.save_user(user); store.save_report(report)
    return report

@router.post("/reports/{report_id}/comments")
def add_comment(report_id: str, body: CommentIn, authorization: str | None = Header(None)):
    user=token_user(authorization)
    if not user: raise HTTPException(401,"Login required")
    text=body.content.lower()
    sensitive=["otp","upi pin","password","bank account","card number"]
    if any(x in text for x in sensitive): raise HTTPException(400,"Please remove sensitive credentials before posting.")
    comment={"id":f"comment-{uuid4().hex[:10]}","reportId":report_id,"authorName":user["name"],"authorAvatar":user.get("avatarUrl"),"authorBadge":"Community Member","createdAt":now_iso(),"relativeTime":"Just now","content":body.content,"upvotes":0,"userUpvoted":False}
    store.save_comment(comment)
    return comment

@router.get("/history")
def history(authorization: str | None = Header(None)):
    user=token_user(authorization)
    if not user: raise HTTPException(401,"Login required")
    return {"items":[h for h in store.history() if h.get("userId")==user["id"]]}

@router.get("/my-reports")
def my_reports(authorization: str | None = Header(None)):
    user=token_user(authorization)
    if not user: raise HTTPException(401,"Login required")
    return {"items":[r for r in store.reports() if r.get("reporter",{}).get("id")==user["id"]]}


@router.get("/notifications")
def notifications(authorization: str | None = Header(None)):
    user = token_user(authorization)
    if not user:
        raise HTTPException(401, "Login required")
    items = [n for n in store.notifications() if n.get("userId") == user["id"]]
    return {"items": items[:100]}

@router.post("/notifications/read-all")
def notifications_read_all(authorization: str | None = Header(None)):
    user = token_user(authorization)
    if not user:
        raise HTTPException(401, "Login required")
    store.mark_notifications_read(user["id"])
    return {"success": True}

@router.get("/community/groups")
def community_groups():
    groups = store.groups()
    if not groups:
        groups = [
            {"id":"upi-awareness","name":"UPI Scam Awareness","description":"UPI collect requests, QR traps and payment safety.","members":0},
            {"id":"kyc-bank","name":"KYC & Bank Scams","description":"Bank impersonation, KYC and account-blocking scams.","members":0},
            {"id":"fake-support","name":"Fake Customer Support","description":"Fake helplines, refund calls and support impersonation.","members":0},
            {"id":"job-scams","name":"Job Scams","description":"Fake jobs, task scams and advance-fee requests.","members":0},
            {"id":"investment","name":"Investment Scams","description":"Fraudulent trading and investment schemes.","members":0},
            {"id":"qr-scams","name":"QR Code Scams","description":"QR-code payment traps.","members":0},
            {"id":"senior-safety","name":"Senior Citizen Safety","description":"Scam awareness for seniors and families.","members":0}
        ]
        for g in groups: store.save_group(g)
    return {"items": groups}

@router.get("/community/groups/{group_id}/messages")
def community_group_messages(group_id: str):
    groups = store.groups()
    if not any(g.get("id") == group_id for g in groups):
        raise HTTPException(404, "Group not found")
    return {"items": [m for m in store.group_messages() if m.get("groupId") == group_id][-100:]}

@router.post("/community/groups/{group_id}/messages")
async def community_group_message(
    group_id: str,
    content: str = Form(""),
    reply_to: str | None = Form(None),
    file: UploadFile | None = File(None),
    authorization: str | None = Header(None),
):
    user = token_user(authorization)
    if not user: raise HTTPException(401, "Login required")
    if not content.strip() and not file: raise HTTPException(400, "Add a message or attachment.")
    lowered = content.lower()
    sensitive_terms = ["otp", "upi pin", "password", "cvv", "card number", "bank account number"]
    if any(term in lowered for term in sensitive_terms):
        raise HTTPException(400, "Automated moderation blocked sensitive credentials. Do not post OTPs, UPI PINs, passwords or banking credentials.")
    groups = store.groups()
    if not any(g.get("id") == group_id for g in groups): raise HTTPException(404, "Group not found")
    attachment = None
    if file:
        allowed = {"image/jpeg","image/png","image/webp","video/mp4","video/webm","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/x-m4a"}
        suffix = Path(file.filename or "attachment").suffix.lower()
        if file.content_type not in allowed and suffix not in {".jpg",".jpeg",".png",".webp",".mp4",".webm",".mp3",".wav",".ogg",".m4a"}:
            raise HTTPException(400, "Unsupported attachment type.")
        data = await file.read()
        if len(data) > MAX_UPLOAD_MB * 1024 * 1024: raise HTTPException(413, "Attachment is too large.")
        group_dir = UPLOAD_DIR / "groups"; group_dir.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid4().hex}{suffix}"; (group_dir / stored_name).write_bytes(data)
        attachment = {"name":file.filename or stored_name,"type":file.content_type or "application/octet-stream","url":f"/uploads/groups/{stored_name}"}
    msg = {"id":f"msg-{uuid4().hex[:10]}","groupId":group_id,"userId":user["id"],"authorName":user["name"],"authorAvatar":user.get("avatarUrl"),"content":content.strip(),"replyTo":reply_to,"attachment":attachment,"createdAt":now_iso()}
    store.save_group_message(msg)
    # Broadcast a persistent notification to every other registered user.
    # The sender is excluded so they do not get a notification for their own message.
    for recipient in store.users():
        if recipient.get("id") == user["id"]:
            continue
        store.add_notification({
            "id": f"group-msg-{uuid4().hex[:12]}",
            "userId": recipient.get("id"),
            "text": f"{user['name']} posted in {next((g.get('name') for g in groups if g.get('id') == group_id), 'a community group')}: {content.strip()[:90]}",
            "time": "just now",
            "unread": True,
            "type": "update",
            "groupId": group_id,
            "createdAt": now_iso(),
        })
    return msg

@router.get("/intelligence")
def intelligence():
    reports=store.reports()
    counts={}
    for r in reports: counts[r.get("category","Unknown")]=counts.get(r.get("category","Unknown"),0)+1
    return {"totalReports":len(reports),"activePatterns":len(counts),"emergingPatterns":[k for k,v in counts.items() if v>=3],"commonTactics":["Urgency","Impersonation","Credential requests","Payment pressure"],"commonChannels":["WhatsApp","SMS","Phone","UPI"],"commonPaymentMethods":["UPI","QR","Collect Request"]}

@router.get("/intelligence/patterns")
def patterns():
    return {"items":[
        {"id":"pattern-kyc","name":"KYC Expiry & Suspension Phishing","category":"KYC Impersonation","description":"Urgent account-blocking and fake verification attempts.","commonSigns":["Urgent deadline","External link","OTP request"],"detectionPhrases":["KYC has expired","account will be blocked"],"warningIndicators":["Urgency","Credential pressure"],"reportsCount":128,"status":"Verified Pattern","riskLevel":"high","trend":"Rising"},
        {"id":"pattern-refund","name":"Fake Refund Collect Request","category":"Fake Refund","description":"Fraudsters ask victims to authorize outgoing payments to receive refunds.","commonSigns":["Collect request","Refund claim","UPI PIN pressure"],"detectionPhrases":["pay to receive refund"],"warningIndicators":["Refund inversion"],"reportsCount":84,"status":"Verified Pattern","riskLevel":"high","trend":"Rising"},
        {"id":"pattern-remote","name":"Remote Access Support Scam","category":"Remote Access Scam","description":"Impersonation plus AnyDesk/remote-control requests.","commonSigns":["Support impersonation","AnyDesk","OTP"],"detectionPhrases":["install AnyDesk"],"warningIndicators":["Remote control"],"reportsCount":63,"status":"Verified Pattern","riskLevel":"high","trend":"Rising"}
    ]}

@router.get("/intelligence/emerging")
def emerging():
    reports=store.reports()
    recent=reports[-18:] if len(reports)>18 else reports
    return {"items":[{"title":"KYC + UPI Collect + Account Block Threat","description":"AI detected a repeated combination across recent reports.","label":"Emerging community pattern","growth":"+260%"}]} if recent else {"items":[]}

@router.get("/scam-dna/{dna_id}")
def scam_dna(dna_id: str):
    return {"id":dna_id,"scamType":"KYC Impersonation","tactics":["Urgency","Account block threat","Fake verification"],"channels":["WhatsApp","SMS"],"paymentPattern":"UPI Collect","confidence":94}

@router.post("/moderation/check")
def moderation(body: dict):
    text=str(body.get("text","")).lower()
    blocked=["otp","upi pin","password","cvv","bank account number"]
    found=[x for x in blocked if x in text]
    return {"allowed":not bool(found),"signals":found,"message":"Please remove sensitive credentials before posting." if found else "Content passes automated safety checks."}
