"""Convenience launcher for the CampusConnect AI backend.

Running ``python backend/run.py`` from *any* working directory:

* puts ``backend/`` on ``sys.path`` so the ``app`` package imports cleanly, and
* points the SQLite fallback at ``backend/campusconnect.db`` (unless
  ``DATABASE_URL`` is already set).

It then starts uvicorn with the FastAPI app, exposing Swagger UI at ``/docs``.
"""

from __future__ import annotations

import os
import pathlib
import sys

BACKEND_DIR = pathlib.Path(__file__).resolve().parent

# Make the ``app`` package importable no matter where the process was started.
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Default the SQLite fallback to a stable location inside backend/.
os.environ.setdefault(
    "DATABASE_URL", f"sqlite+aiosqlite:///{(BACKEND_DIR / 'campusconnect.db').as_posix()}"
)


def main() -> None:
    """Run the API with uvicorn."""
    import uvicorn

    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "8000"))
    reload_enabled = os.environ.get("RELOAD", "false").lower() in {"1", "true", "yes"}

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload_enabled,
        log_level=os.environ.get("LOG_LEVEL", "info").lower(),
    )


if __name__ == "__main__":
    main()
