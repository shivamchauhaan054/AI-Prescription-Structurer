import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq
from pydantic import ValidationError

from app.schemas.response import ExtractResponse
from app.utils.constants import SYSTEM_PROMPT
from app.utils.parser import (
    MalformedLLMResponseError,
    expand_shorthand,
    extract_json_object,
)

BACKEND_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"


class GroqServiceError(Exception):
    pass


class GroqTimeoutError(Exception):
    pass


class GroqService:
    def __init__(self) -> None:
        # Always load backend/.env explicitly so startup cwd does not matter.
        load_dotenv(dotenv_path=BACKEND_ENV_PATH, override=True)
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        if not api_key:
            raise GroqServiceError("GROQ_API_KEY is not set.")

        self.client = Groq(api_key=api_key)
        self.model_names = [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
        ]

    def _generate_content(self, prompt: str):
        last_error: Exception | None = None
        for model_name in self.model_names:
            try:
                return self.client.chat.completions.create(
                    model=model_name,
                    temperature=0,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt},
                    ],
                )
            except Exception as exc:
                last_error = exc
                continue
        raise GroqServiceError(f"Groq API call failed: {last_error}")

    async def extract(self, text: str, timeout_seconds: int = 25) -> ExtractResponse:
        prompt = (
            f"Input prescription text:\n{expand_shorthand(text)}\n\n"
            "Return JSON only."
        )

        try:
            response = await asyncio.wait_for(
                asyncio.to_thread(self._generate_content, prompt),
                timeout=timeout_seconds,
            )
        except asyncio.TimeoutError as exc:
            raise GroqTimeoutError("Groq request timed out.") from exc
        except GroqServiceError:
            raise
        except Exception as exc:
            raise GroqServiceError(f"Groq API call failed: {exc}") from exc

        content = response.choices[0].message.content if response.choices else None
        if not content:
            raise MalformedLLMResponseError("Groq returned empty response.")

        parsed = extract_json_object(content)
        try:
            return ExtractResponse.model_validate(parsed)
        except ValidationError as exc:
            raise MalformedLLMResponseError(
                f"LLM response failed schema validation: {exc}"
            ) from exc
