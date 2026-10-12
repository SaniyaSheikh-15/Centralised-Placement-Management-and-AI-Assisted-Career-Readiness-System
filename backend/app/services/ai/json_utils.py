"""Helpers for parsing LLM JSON output defensively.

Even with ``response_mime_type="application/json"`` models occasionally wrap the
document in markdown fences or add a stray sentence. These helpers extract the
first valid JSON object/array and validate it, raising a clear error otherwise.
"""

from __future__ import annotations

import json
import re
from typing import Any, TypeVar

from pydantic import BaseModel, ValidationError as PydanticValidationError

from app.core.exceptions import AIProviderError

TModel = TypeVar("TModel", bound=BaseModel)

_FENCE_RE = re.compile(r"```(?:json)?\s*(.*?)\s*```", re.DOTALL)


def extract_json(raw: str) -> Any:
    """Return the parsed JSON value contained in ``raw``.

    Tries, in order: the whole string, the contents of a markdown code fence,
    and finally the outermost ``{...}`` or ``[...]`` span.
    """
    candidates: list[str] = [raw.strip()]

    fence = _FENCE_RE.search(raw)
    if fence:
        candidates.append(fence.group(1).strip())

    for opener, closer in (("{", "}"), ("[", "]")):
        start, end = raw.find(opener), raw.rfind(closer)
        if start != -1 and end != -1 and end > start:
            candidates.append(raw[start : end + 1])

    for candidate in candidates:
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue

    raise AIProviderError("The AI response did not contain valid JSON.")


def parse_model(raw: str, model: type[TModel], *, default: TModel | None = None) -> TModel:
    """Parse ``raw`` into ``model``, returning ``default`` on validation failure.

    When ``default`` is ``None`` a failure raises :class:`AIProviderError` so the
    caller can return a 502 rather than silently returning garbage.
    """
    try:
        data = extract_json(raw)
        return model.model_validate(data)
    except (AIProviderError, PydanticValidationError) as exc:
        if default is not None:
            return default
        raise AIProviderError(f"Could not parse AI response into {model.__name__}: {exc}") from exc
