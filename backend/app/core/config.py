"""Application configuration.

All settings are read from environment variables (or a local ``.env`` file)
so that secrets such as ``GEMINI_API_KEY`` and ``JWT_SECRET_KEY`` are never
hard-coded. The PRD explicitly requires the Gemini key to live only on the
backend and never be exposed to the frontend.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Annotated, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

# ``app/core/config.py`` -> ``backend/`` so ``.env`` loads regardless of cwd.
_BACKEND_DIR = Path(__file__).resolve().parents[2]
_ENV_FILE = _BACKEND_DIR / ".env"

# Provider selection modes.
AIProviderMode = Literal["auto", "gemini", "stub"]
Environment = Literal["development", "staging", "production"]


class Settings(BaseSettings):
    """Strongly-typed application settings.

    Values are sourced (in order of precedence) from:
    1. Real environment variables.
    2. The ``backend/.env`` file, if present.
    3. The defaults declared below.
    """

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Application --------------------------------------------------
    app_name: str = "CampusConnect AI Modules API"
    app_version: str = "1.0.0"
    environment: Environment = "development"
    debug: bool = True
    log_level: str = "INFO"

    # FastAPI mounts every AI endpoint under this prefix (PRD §2.3 / §3.4).
    api_v1_prefix: str = "/api/v1"

    # --- Database -----------------------------------------------------
    # Default is a zero-infra SQLite file so the service boots anywhere.
    # Production overrides this with a PostgreSQL DSN, e.g.
    #   postgresql+psycopg://user:pass@host:5432/placement_management_db
    database_url: str = "sqlite+aiosqlite:///./campusconnect.db"
    db_echo: bool = False

    # --- JWT / Auth ---------------------------------------------------
    jwt_secret_key: str = "dev-only-insecure-secret-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    enable_dev_auth: bool = True

    # --- Gemini AI ----------------------------------------------------
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    ai_provider: AIProviderMode = "auto"
    ai_request_timeout_seconds: int = 45
    ai_max_retries: int = 2
    ai_temperature: float = 0.7

    # --- CORS ---------------------------------------------------------
    # ``NoDecode`` stops pydantic-settings from JSON-decoding the env value, so
    # operators can write a plain comma-separated list; the validator below then
    # splits it. (Without this, ``a,b`` raises a JSONDecodeError at startup.)
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"]
    )

    # --- Seeding ------------------------------------------------------
    seed_demo_data: bool = True

    # --- Derived helpers ---------------------------------------------

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        """Accept either a comma-separated string or a real list.

        Pydantic-settings parses ``CORS_ORIGINS`` as JSON by default, which is
        awkward for humans; this validator lets operators write plain
        ``a,b,c`` in ``.env``.
        """
        if isinstance(value, str) and not value.strip().startswith("["):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def is_sqlite(self) -> bool:
        """True when running against the local SQLite fallback."""
        return self.database_url.startswith("sqlite")

    @property
    def resolved_ai_provider(self) -> Literal["gemini", "stub"]:
        """Return the concrete provider to instantiate.

        ``auto`` chooses Gemini when a key is configured, otherwise the stub so
        that the API remains fully exercisable (e.g. via Swagger) offline.
        """
        if self.ai_provider == "gemini":
            return "gemini"
        if self.ai_provider == "stub":
            return "stub"
        return "gemini" if self.gemini_api_key else "stub"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide cached :class:`Settings` instance."""
    return Settings()


# Convenient module-level singleton for import sites that do not use DI.
settings = get_settings()
