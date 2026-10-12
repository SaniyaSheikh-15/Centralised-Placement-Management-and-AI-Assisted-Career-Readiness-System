"""FastAPI application entry point.

Wires together configuration, logging, database bootstrap, CORS, exception
handlers and the v1 API router. Starts the app with Swagger UI available at
``/docs`` (and ReDoc at ``/redoc``) as required for API verification.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import AppError, app_error_handler
from app.core.logging_config import configure_logging, get_logger
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.schemas.common import HealthResponse
from app.services.ai import get_ai_provider

# Import models so ``Base.metadata`` is fully populated before create_all().
import app.db.models  # noqa: F401

logger = get_logger(__name__)

# OpenAPI tag metadata - keeps Swagger UI grouped and readable.
_TAGS_METADATA = [
    {"name": "Health", "description": "Service health and readiness."},
    {"name": "Authentication", "description": "JWT login, refresh and identity."},
    {"name": "AI Mock Interview", "description": "Module 1 - interview simulation and evaluation."},
    {"name": "AI Career Assistant", "description": "Module 2 - RAG-grounded career guidance."},
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown hooks: logging, schema creation, seeding, AI provider."""
    configure_logging(settings.log_level)
    logger.info("Starting %s v%s (%s)", settings.app_name, settings.app_version, settings.environment)

    # Create any missing tables. In production, migrations (Alembic) are the
    # source of truth; this guarantees the app boots on a fresh database.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database schema ensured (%s).", "sqlite" if settings.is_sqlite else "postgresql")

    if settings.seed_demo_data:
        from app.db.seed import seed_demo_data

        async with SessionLocal() as session:
            await seed_demo_data(session)
            await session.commit()

    # Initialise the AI provider eagerly so misconfiguration surfaces at boot.
    provider = get_ai_provider()
    logger.info("AI provider ready: %s", provider.name)

    yield
    await engine.dispose()
    logger.info("Shutdown complete.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend for the CampusConnect **AI Modules**: an AI Mock Interview "
        "engine and an AI Career Assistant built on RAG. Every endpoint is "
        "secured with JWT + RBAC."
    ),
    lifespan=lifespan,
    openapi_tags=_TAGS_METADATA,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS - allow the Next.js frontend to call the API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uniform JSON errors for all expected application failures.
app.add_exception_handler(AppError, app_error_handler)


@app.get("/", tags=["Health"], summary="Root")
async def root() -> dict[str, str]:
    """Basic landing payload pointing to the docs."""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"], summary="Health check")
async def health() -> HealthResponse:
    """Report service status, resolved AI provider and database backend."""
    return HealthResponse(
        status="ok",
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        ai_provider=get_ai_provider().name,
        database="sqlite" if settings.is_sqlite else "postgresql",
    )


# Mount all v1 AI endpoints under the configured prefix (``/api/v1``).
app.include_router(api_router, prefix=settings.api_v1_prefix)
