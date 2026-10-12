"""AI provider factory.

Resolves the concrete :class:`AIProvider` from settings and caches it for the
process lifetime. With ``AI_PROVIDER=auto`` (the default) Gemini is used when a
``GEMINI_API_KEY`` is present, otherwise the deterministic stub keeps the API
fully operational offline.
"""

from __future__ import annotations

from functools import lru_cache

from app.core.config import settings
from app.core.exceptions import AIProviderError
from app.core.logging_config import get_logger
from app.services.ai.base import AIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.stub_provider import StubProvider

logger = get_logger(__name__)


@lru_cache(maxsize=1)
def get_ai_provider() -> AIProvider:
    """Return the process-wide AI provider instance."""
    choice = settings.resolved_ai_provider

    if choice == "gemini":
        try:
            provider = GeminiProvider()
            logger.info("AI provider initialised: gemini (%s)", settings.gemini_model)
            return provider
        except Exception as exc:  # noqa: BLE001
            # If Gemini was *forced* we surface the error; in auto mode we fall
            # back to the stub so the service still boots.
            if settings.ai_provider == "gemini":
                raise AIProviderError(f"Failed to initialise Gemini: {exc}") from exc
            logger.warning("Gemini init failed (%s); falling back to offline stub.", exc)

    logger.info("AI provider initialised: offline stub")
    return StubProvider()
