"""AI provider interface.

Both the Gemini implementation and the offline stub conform to this contract.
Service code depends only on :class:`AIProvider`, so the vendor is a one-line
swap (satisfying the PRD's extensibility requirement - e.g. a future Whisper
speech-to-text provider).

A lightweight ``AITask`` tag travels alongside each request. Gemini ignores it
(it is metadata about intent); the stub uses it to synthesise deterministic,
schema-valid output so the whole API is exercisable without network access.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from enum import Enum


class AITask(str, Enum):
    """The kind of generation being requested (drives stub behaviour)."""

    QUESTION_GENERATION = "question_generation"
    ANSWER_EVALUATION = "answer_evaluation"
    SESSION_SUMMARY = "session_summary"
    CAREER_CHAT = "career_chat"
    RESUME_QA = "resume_qa"
    GUIDANCE = "guidance"


class AIProvider(ABC):
    """Abstract asynchronous text-generation provider."""

    #: Human-readable provider name (surfaced by the health endpoint).
    name: str = "abstract"

    @abstractmethod
    async def generate_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        as_json: bool = False,
        temperature: float | None = None,
    ) -> str:
        """Generate text for ``prompt``.

        Parameters
        ----------
        prompt:
            The fully-rendered user/content prompt.
        system_instruction:
            Optional system-level instructions (grounding, persona, format).
        task:
            Semantic tag for the generation (used by the stub provider).
        as_json:
            When ``True`` the provider is asked to return strict JSON only.
        temperature:
            Optional sampling temperature override.

        Returns
        -------
        str
            The raw model text. When ``as_json`` is true this should be a JSON
            document; callers parse it defensively.
        """
        raise NotImplementedError

    async def stream_text(
        self,
        *,
        prompt: str,
        system_instruction: str | None = None,
        task: AITask | None = None,
        temperature: float | None = None,
    ) -> AsyncIterator[str]:
        """Yield the generated text incrementally.

        The PRD asks for streaming "if generation takes >3 seconds". A sensible
        default is to fall back to a single chunk from :meth:`generate_text`, so
        every provider is streamable without duplicating logic; providers with a
        real streaming API (Gemini) override this for true token-by-token output.
        """
        text = await self.generate_text(
            prompt=prompt,
            system_instruction=system_instruction,
            task=task,
            temperature=temperature,
        )
        yield text
