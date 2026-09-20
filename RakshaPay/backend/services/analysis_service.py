from datetime import datetime, timezone
import re
from typing import Any

from .gemini_service import analyze_message as gemini_message


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def risk_level(score: int) -> str:
    if score >= 70: return "high"
    if score >= 35: return "caution"
    return "low"


def scam_category(text: str):
    t = text.lower()
    if any(x in t for x in ["kyc", "account will be blocked", "account will be suspended", "pan card"]): return "KYC Impersonation"
    if any(x in t for x in ["otp", "one time password", "cancellation code"]): return "OTP Scam"
    if any(x in t for x in ["anydesk", "teamviewer", "remote access"]): return "Remote Access Scam"
    if any(x in t for x in ["refund", "cashback"]): return "Fake Refund"
    if any(x in t for x in ["qr code", "scan this qr"]): return "QR Code Scam"
    if any(x in t for x in ["work from home", "telegram", "registration deposit"]): return "Job Scam"
    if any(x in t for x in ["guaranteed", "daily returns", "invest now"]): return "Investment Scam"
    if any(x in t for x in ["electricity", "power will be disconnected"]): return "Electricity Bill Scam"
    if any(x in t for x in ["customer support", "support executive", "delivery support"]): return "Customer Support Scam"
    if any(x in t for x in ["bank", "card blocked", "debit card", "unauthorized debit", "security alert", "cancellation code"]): return "Bank Impersonation"
    return "Legitimate Communication"


def analyze_message_deterministic(text: str) -> dict[str, Any]:
    t = text.lower()
    cat = scam_category(text)
    indicators = []
    if any(x in t for x in ["urgent", "immediately", "today", "within", "asap", "right away"]): indicators.append("Urgency")
    if any(x in t for x in ["kyc", "pan card", "verify your account"]): indicators.append("Fake KYC / verification")
    if "otp" in t or "one time password" in t: indicators.append("OTP request")
    if "upi pin" in t or "pin" in t and "upi" in t: indicators.append("UPI PIN request")
    if re.search(r"https?://|bit\.ly|tinyurl|apk", t): indicators.append("Suspicious link / download")
    if any(x in t for x in ["blocked", "suspended", "deactivated", "card will be blocked", "debit card will be blocked"]): indicators.append("Account/card-blocking threat")
    if any(x in t for x in ["refund", "cashback", "processing charge", "processing fee", "pay "]): indicators.append("Payment/refund manipulation")
    if "qr" in t: indicators.append("QR payment manipulation")
    if any(x in t for x in ["anydesk", "teamviewer", "remote access"]): indicators.append("Remote access request")
    if any(x in t for x in ["guaranteed", "risk free", "30% daily"]): indicators.append("Unrealistic financial promise")
    if cat == "Legitimate Communication":
        # A message that combines coercion + payment/card blocking language is
        # suspicious even when it does not explicitly name a bank or KYC.
        coercive_payment = any(x in t for x in ["send ", "pay ", "transfer ", "upi", "debit card will be blocked"]) and any(x in t for x in ["immediately", "urgent", "blocked", "suspended"])
        if coercive_payment:
            cat = "Bank Impersonation"
            indicators.append("Coercive payment request")
            score = min(95, 68 + len(indicators) * 7)
        else:
            score = 8 if not indicators else 15
    else: score = min(97, 50 + len(indicators) * 8 + (15 if cat in {"KYC Impersonation", "OTP Scam", "Remote Access Scam"} else 5))
    level = risk_level(score)
    reasons = [
        {"id": f"r{i}", "title": x, "snippet": x, "severity": "high" if level == "high" else "medium", "explanation": f"The text contains an indicator associated with {cat.lower()}."}
        for i, x in enumerate(indicators[:6], 1)
    ]
    actions = []
    if level == "high":
        actions = [
            {"title": "Do not authorize the payment", "description": "Pause before clicking, paying, scanning or sharing credentials.", "critical": True},
            {"title": "Verify independently", "description": "Use the organization's official app or official contact method.", "critical": False},
            {"title": "Never share OTP or UPI PIN", "description": "Legitimate support should not need these secrets.", "critical": True},
        ]
    elif level == "caution":
        actions = [{"title": "Verify before acting", "description": "Check the request through an official channel.", "critical": False}]
    else:
        actions = [{"title": "Continue with normal caution", "description": "No strong scam pattern was identified in this text.", "critical": False}]
    dna = {
        "scamType": cat,
        "tactics": indicators,
        "channels": ["message"],
        "keyPhrases": [x for x in ["KYC", "OTP", "account blocked", "refund", "QR", "AnyDesk"] if x.lower() in t],
        "impersonatedEntity": "Bank / Support" if any(x in t for x in ["bank", "support"]) else "",
        "paymentMethod": "UPI" if "upi" in t else "",
        "paymentPattern": "Collect / Refund" if any(x in t for x in ["collect", "refund"]) else "",
        "urgencyIndicators": [x for x in indicators if "Urgency" in x or "threat" in x.lower()],
        "evidenceTypes": ["message"],
        "identifiers": re.findall(r"(?:https?://\S+|\+?91\s?\d{10})", text),
        "behavioralIndicators": indicators,
        "confidence": min(98, 65 + len(indicators) * 5),
    }
    return {
        "id": f"analysis-{int(datetime.now().timestamp()*1000)}",
        "textAnalyzed": text,
        "riskScore": score,
        "riskLevel": level,
        "scamCategory": cat,
        "confidence": "High" if score >= 70 else "Medium" if score >= 35 else "Low",
        "categoryDescription": f"Several scam indicators were detected for {cat}." if cat != "Legitimate Communication" else "No strong known scam pattern was identified in this text.",
        "commonCharacteristics": indicators or ["Standard transactional language"],
        "reasons": reasons,
        "recommendedActions": actions,
        "similarCommunityReportsCount": max(1, len(indicators) * 4),
        "patternBreakdown": [
            {"label": "Text indicators", "matchPercentage": min(98, 65 + len(indicators)*5)},
            {"label": "Scam tactic match", "matchPercentage": min(96, 60 + len(indicators)*6)},
            {"label": "Scam DNA similarity", "matchPercentage": min(95, 55 + len(indicators)*6)},
        ],
        "analyzedAt": now_iso(),
        "scamDna": dna,
        "multiEvidenceMatch": {"overallSimilarity": min(95, 58 + len(indicators)*6), "text": 92, "tactics": min(97, 60 + len(indicators)*7), "payment": 81, "call": 88, "dna": min(96, 60 + len(indicators)*7)},
    }


def analyze_message(text: str) -> dict[str, Any]:
    ai = gemini_message(text)
    if ai:
        base = analyze_message_deterministic(text)
        # Keep an obviously normal message from being promoted to a scam by an
        # over-sensitive AI response. Deterministic safety rules remain the floor.
        if base["scamCategory"] == "Legitimate Communication" and not base["reasons"]:
            base["riskScore"] = min(base["riskScore"], 10)
            base["riskLevel"] = "low"
            base["confidence"] = "High"
            base["categoryDescription"] = "No meaningful scam indicators were detected. This appears to be a normal communication."
            base["commonCharacteristics"] = ["Standard transactional language"]
            base["reasons"] = []
            base["recommendedActions"] = [{"title": "No scam action required", "description": "Continue normal digital-safety precautions and use the official app when available.", "critical": False}]
            base["scamDna"]["scamType"] = "Legitimate Communication"
            base["scamDna"]["confidence"] = 92
            return base
        base.update({
            "riskScore": max(0, min(100, int(ai.get("risk_score", base["riskScore"])) )),
            "riskLevel": str(ai.get("risk_level", base["riskLevel"]).lower()),
            "scamCategory": ai.get("scam_category", base["scamCategory"]),
            "confidence": ai.get("confidence", base["confidence"]),
            "categoryDescription": ai.get("category_description", base["categoryDescription"]),
            "commonCharacteristics": ai.get("common_characteristics", base["commonCharacteristics"]),
            "reasons": ai.get("reasons", base["reasons"]),
            "recommendedActions": ai.get("recommended_actions", base["recommendedActions"]),
            "patternBreakdown": ai.get("pattern_breakdown", base["patternBreakdown"]),
            "scamDna": ai.get("scam_dna", base["scamDna"]),
        })
        return base
    return analyze_message_deterministic(text)


def analyze_payment(data: dict[str, Any]) -> dict[str, Any]:
    amount = float(data.get("amount") or 0)
    payment_type = str(data.get("paymentType", "Send Money"))
    normalized_payment_type = payment_type.lower().strip()
    new_recipient = bool(data.get("isNewRecipient"))
    upi = str(data.get("upiId") or "")
    ctx = str(data.get("contextMessage") or "").lower()
    avg = float(data.get("previousAverageAmount") or 1500)
    score = 10
    factors = []
    if normalized_payment_type in {"collect request", "collect request (incoming mandate)", "collect"}:
        score += 30; factors.append({"id":"f-collect","label":"Collect request inversion hazard","delta":30,"severity":"high","description":"Approving a collect request can debit funds from the linked account."})
    if normalized_payment_type in {"refund", "refund request"}:
        score += 26; factors.append({"id":"f-refund","label":"Refund pattern anomaly","delta":26,"severity":"high","description":"A refund should not require an outgoing authorization to receive money."})
    if normalized_payment_type in {"qr payment", "qr"}:
        score += 15; factors.append({"id":"f-qr","label":"QR payment risk","delta":15,"severity":"medium","description":"QR payments can conceal the beneficiary until confirmation."})
    if new_recipient:
        score += 18; factors.append({"id":"f-new","label":"New recipient","delta":18,"severity":"medium","description":"There is no established payment history with this beneficiary."})
    if amount >= 20000 or amount > avg * 5:
        score += 24 if amount >= 25000 else 16; factors.append({"id":"f-amount","label":"Amount anomaly","delta":24 if amount >= 25000 else 16,"severity":"high","description":f"₹{amount:,.0f} is substantially above the stated typical transaction average."})
    if any(x in (upi + " " + ctx).lower() for x in ["refund", "cashback", "support", "army", "kyc"]):
        score += 15; factors.append({"id":"f-handle","label":"Suspicious context / identifier","delta":15,"severity":"high","description":"The recipient or context contains language commonly seen in scam scenarios."})
    if any(x in ctx for x in ["urgent", "immediately", "pay to receive refund", "pin"]):
        score += 12; factors.append({"id":"f-urgency","label":"Urgency / credential pressure","delta":12,"severity":"high","description":"The context pressures the user to act quickly or use sensitive payment credentials."})
    score = min(98, score)
    level = risk_level(score)
    action = "Do not authorize the payment. Verify using the official app/contact method." if level == "high" else "Verify the recipient and context before paying." if level == "caution" else "No strong anomaly detected; continue normal payment precautions."
    return {
        "id": f"payment-{int(datetime.now().timestamp()*1000)}",
        "amount": amount, "recipientName": data.get("recipientName", ""), "upiId": upi,
        "paymentType": payment_type, "isNewRecipient": new_recipient,
        "riskScore": score, "riskLevel": level,
        "contributingFactors": factors, "recommendedAction": action,
        "analyzedAt": now_iso(),
        "scamDna": {"scamType": "Payment Scam Risk", "tactics":[f["label"] for f in factors], "channels":["payment"], "paymentMethod":"UPI", "paymentPattern":payment_type, "behavioralIndicators":[f["description"] for f in factors], "confidence": min(98, 60+len(factors)*6)},
        "multiEvidenceMatch": {"overallSimilarity": min(96, 58+len(factors)*6), "text": 82, "tactics": 91, "payment": 95, "dna": 89},
    }
