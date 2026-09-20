import json
from pathlib import Path
from typing import Any

from ..config import GEMINI_API_KEY, GEMINI_MODEL

try:
    from google import genai
    from google.genai import types
except Exception:  # optional until Gemini is configured
    genai = None
    types = None


SYSTEM_INSTRUCTION = """
You are SCAMSHIELD, a safety-focused scam analysis engine.
Do not claim certainty. Use phrases such as 'Several scam indicators were detected',
'Matches a reported scam pattern', and 'Strong similarity to community reports'.
Never call a person a scammer/fraudster. Never request or reveal OTPs, UPI PINs,
passwords or bank credentials. Produce concise, structured, explainable output.
""".strip()


def _client():
    if not GEMINI_API_KEY or genai is None:
        return None
    return genai.Client(api_key=GEMINI_API_KEY)


def _extract_json(text: str) -> dict[str, Any] | None:
    if not text:
        return None
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass
    start, end = text.find("{"), text.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            return None
    return None


def generate_json(prompt: str, schema: dict[str, Any] | None = None) -> dict[str, Any] | None:
    client = _client()
    if client is None:
        return None
    try:
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=schema or None,
            temperature=0.2,
            max_output_tokens=2500,
        )
        result = client.models.generate_content(model=GEMINI_MODEL, contents=prompt, config=config)
        return _extract_json(result.text or "")
    except Exception:
        return None


def analyze_message(text: str) -> dict[str, Any] | None:
    schema = {
        "type": "object",
        "properties": {
            "risk_score": {"type": "integer"},
            "risk_level": {"type": "string"},
            "scam_category": {"type": "string"},
            "confidence": {"type": "string"},
            "category_description": {"type": "string"},
            "common_characteristics": {"type": "array", "items": {"type": "string"}},
            "reasons": {"type": "array", "items": {"type": "object"}},
            "recommended_actions": {"type": "array", "items": {"type": "object"}},
            "pattern_breakdown": {"type": "array", "items": {"type": "object"}},
            "scam_dna": {"type": "object"},
        },
        "required": ["risk_score", "risk_level", "scam_category", "confidence", "category_description", "common_characteristics", "reasons", "recommended_actions", "pattern_breakdown", "scam_dna"],
    }
    prompt = f"""
Analyze this message for scam indicators. Return JSON matching the requested schema.
Message:
{text}

Scam DNA should include scamType, tactics, channels, keyPhrases, impersonatedEntity,
paymentMethod, paymentPattern, urgencyIndicators, evidenceTypes, identifiers,
behavioralIndicators, confidence.
"""
    return generate_json(prompt, schema)


def analyze_call(path: Path, mime_type: str) -> dict[str, Any] | None:
    client = _client()
    if client is None:
        return None
    try:
        uploaded = client.files.upload(file=str(path))
        schema = {
            "type": "object",
            "properties": {
                "risk_score": {"type": "integer"},
                "risk_level": {"type": "string"},
                "scam_category": {"type": "string"},
                "detected_signals": {"type": "array", "items": {"type": "string"}},
                "suspicious_indicators": {"type": "array", "items": {"type": "object"}},
                "timeline": {"type": "array", "items": {"type": "object"}},
                "transcript": {"type": "array", "items": {"type": "object"}},
                "summary": {"type": "string"},
                "recommended_action": {"type": "string"},
                "scam_dna": {"type": "object"},
            },
            "required": ["risk_score", "risk_level", "scam_category", "detected_signals", "suspicious_indicators", "timeline", "transcript", "summary", "recommended_action", "scam_dna"],
        }
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION + "\nAnalyze the uploaded audio recording. Return JSON only.",
            response_mime_type="application/json",
            response_schema=schema,
            temperature=0.2,
            max_output_tokens=4000,
        )
        result = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[uploaded, "Transcribe and analyze this call for scam signals, timestamps and Scam DNA."],
            config=config,
        )
        return _extract_json(result.text or "")
    except Exception:
        return None
