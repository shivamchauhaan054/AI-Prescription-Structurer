import json
import re
from typing import Any, Dict

from app.utils.constants import SHORTHAND_MAP


class MalformedLLMResponseError(Exception):
    pass


# Backward-compatible alias for older imports.
MalformedGeminiResponseError = MalformedLLMResponseError


def expand_shorthand(text: str) -> str:
    expanded = text
    for short, full in SHORTHAND_MAP.items():
        expanded = re.sub(rf"\b{short}\b", full, expanded, flags=re.IGNORECASE)
    return expanded


def extract_json_object(raw_text: str) -> Dict[str, Any]:
    cleaned = raw_text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    first = cleaned.find("{")
    last = cleaned.rfind("}")
    if first == -1 or last == -1 or first >= last:
        raise MalformedLLMResponseError("No valid JSON object detected.")

    candidate = cleaned[first : last + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise MalformedLLMResponseError("LLM response is malformed JSON.") from exc
