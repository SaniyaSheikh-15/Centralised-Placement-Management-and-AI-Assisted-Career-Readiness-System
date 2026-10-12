"""Shared schema helpers.

The existing Next.js client (``career-assistant/src/lib/api.ts``) speaks
**camelCase**. To keep the backend drop-in compatible we serialise every
payload with a camelCase alias while still allowing snake_case construction in
Python (`populate_by_name=True`).
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelModel(BaseModel):
    """Base model that (de)serialises using camelCase field aliases.

    * ``alias_generator=to_camel``        → responses use ``sessionId`` etc.
    * ``populate_by_name=True``           → Python code may still use ``session_id``.
    * ``from_attributes=True``            → build straight from ORM objects.
    """

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        ser_json_timedelta="float",
    )


class ErrorDetail(CamelModel):
    """Machine-readable error payload returned for every ``AppError``."""

    code: str = Field(description="Stable, machine-readable error code.")
    message: str = Field(description="Human-readable explanation of the failure.")


class ErrorResponse(CamelModel):
    """Envelope used by the global exception handler."""

    error: ErrorDetail


class MessageResponse(CamelModel):
    """Generic ``{"message": "..."}`` acknowledgement."""

    message: str


class PaginatedResponse(CamelModel, Generic[T]):
    """Lightweight pagination envelope for list endpoints."""

    items: list[T]
    total: int
    limit: int
    offset: int


class HealthResponse(CamelModel):
    """Service health/readiness probe payload."""

    status: str
    app_name: str
    version: str
    environment: str
    ai_provider: str
    database: str
