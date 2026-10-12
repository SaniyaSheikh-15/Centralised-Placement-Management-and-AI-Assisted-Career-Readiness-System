"""Declarative base and shared column mixins.

Every ORM model in ``app.db.models`` inherits from :class:`Base`. The models
mirror the *frozen* PostgreSQL schema in ``database/sql/placement_management_v1.sql``
so the FastAPI backend can read/write the same tables the rest of CampusConnect
uses. A handful of additional tables (interview sessions/questions) are owned
solely by this backend and are documented in ``app/db/models/ai.py``.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow() -> datetime:
    """Timezone-aware UTC now (``datetime.utcnow`` is deprecated in 3.12+)."""
    return datetime.now(timezone.utc)


def as_utc(value: datetime | None) -> datetime | None:
    """Return ``value`` as a timezone-aware UTC datetime.

    SQLite does not persist timezone information, so datetimes read back from it
    are *naive* while application timestamps are *aware*. Normalising here avoids
    "can't subtract offset-naive and offset-aware datetimes" errors and keeps
    arithmetic consistent across both backends.
    """
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


class Base(DeclarativeBase):
    """Root declarative base for all ORM models."""

    # Ensures string-based relationship targets resolve deterministically.
    __abstract__ = True


class UUIDPrimaryKeyMixin:
    """Adds a UUID primary key generated client-side.

    Generated in Python (not by the database) so the same model works on both
    PostgreSQL and the SQLite fallback, which has no ``gen_random_uuid()``.
    """

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )


class TimestampMixin:
    """Adds ``created_at`` / ``updated_at`` columns with sane defaults."""

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )
