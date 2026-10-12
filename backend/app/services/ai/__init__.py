"""Pluggable AI providers (Gemini in production, offline stub for tests)."""

from app.services.ai.base import AIProvider, AITask
from app.services.ai.factory import get_ai_provider

__all__ = ["AIProvider", "AITask", "get_ai_provider"]
