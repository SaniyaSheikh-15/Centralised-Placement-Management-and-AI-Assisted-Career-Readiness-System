"""Google Gemini implementation of :class:`AIProvider`.

Uses the official ``google-genai`` SDK. The API key is injected from settings
(env var) and never logged or returned. Requests are retried with exponential
backoff on transient failures, and JSON responses are requested natively via
``response_mime_type`` so downstream parsing is reliable.
"""

from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

from app.core.config import settings
from app.core.exceptions import AIProviderError
from app.core.logging_config import get_logger
from app.services.ai.base import AIProvider, AITask

logger = get_logger(__name__)


class GeminiProvider(AIProvider):
    """Async Gemini text-generation provider."""

    name = "gemini"

    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        # Imported lazily so the stub provider works even if the SDK is absent.
        from google import genai

        self._api_key = api_key or settings.gemini_api_key
        self._model = model or settings.gemini_model
        if not self._api_key:
            raise AIProviderError("GEMINI_API_KEY is not configured.")
        self._client = genai.Client(api_key=self._api_key)

    async def generate_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        as_json: bool = False,
        temperature: float | None = None,
    ) -> str:
        """Call ``generate_content`` on Gemini with retries.

        ``task`` is unused here (it only steers the stub provider).
        """
        from google.genai import types

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=settings.ai_temperature if temperature is None else temperature,
            # Force valid JSON when a structured response is expected.
            response_mime_type="application/json" if as_json else "text/plain",
        )

        last_error: Exception | None = None
        attempts = max(1, settings.ai_max_retries + 1)

        for attempt in range(1, attempts + 1):
            try:
                response = await asyncio.wait_for(
                    self._client.aio.models.generate_content(
                        model=self._model, contents=prompt, config=config
                    ),
                    timeout=settings.ai_request_timeout_seconds,
                )
                text = getattr(response, "text", None)
                if not text:
                    raise AIProviderError("Gemini returned an empty response.")
                return text
            except Exception as exc:  # noqa: BLE001 - we re-raise as AIProviderError
                last_error = exc
                logger.warning(
                    "Gemini request failed (attempt %s/%s): %s", attempt, attempts, exc
                )
                if attempt < attempts:
                    # Exponential backoff: 0.5s, 1s, 2s ...
                    await asyncio.sleep(0.5 * (2 ** (attempt - 1)))

        raise AIProviderError(
            f"Gemini request failed after {attempts} attempt(s): {last_error}"
        ) from last_error

    async def stream_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        temperature: float | None = None,
    ) -> AsyncIterator[str]:
        """Stream Gemini output token-by-token (PRD §4 streaming requirement).

        Streaming is intentionally *not* retried: once the first bytes have been
        sent to the client the response cannot be restarted, so a mid-stream
        failure is surfaced rather than silently retried.
        """
        from google.genai import types

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=settings.ai_temperature if temperature is None else temperature,
        )
        try:
            stream = await self._client.aio.models.generate_content_stream(
                model=self._model, contents=prompt, config=config
            )
            async for chunk in stream:
                text = getattr(chunk, "text", None)
                if text:
                    yield text
        except Exception as exc:  # noqa: BLE001 - normalise to a domain error
            logger.warning("Gemini streaming failed: %s", exc)
            raise AIProviderError(f"Gemini streaming failed: {exc}") from exc
