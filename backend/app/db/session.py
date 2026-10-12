"""Async SQLAlchemy engine and session factory.

Uses the async engine so database work never blocks the event loop while AI
calls are in flight. The DSN is injected via ``DATABASE_URL`` (PostgreSQL in
production, a SQLite fallback locally).
"""

from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# ----------------------------------------------------------------------
# Engine
# ----------------------------------------------------------------------
# ``pool_pre_ping`` recycles dead connections (important for long-lived
# Postgres deployments behind a pooler). ``future=True`` is implicit in 2.x.
_engine_kwargs: dict[str, object] = {
    "echo": settings.db_echo,
    "pool_pre_ping": True,
}

# SQLite (the local fallback) does not support connection pooling the same way
# and forbids cross-thread sharing; relax the relevant checks there.
if settings.is_sqlite:
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine: AsyncEngine = create_async_engine(settings.database_url, **_engine_kwargs)

# ``expire_on_commit=False`` keeps ORM attributes usable after commit, which
# lets services return freshly persisted objects without a re-query.
SessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency yielding a request-scoped database session.

    The session is closed automatically; on an unhandled exception the
    transaction is rolled back before the connection returns to the pool.
    """
    async with SessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
