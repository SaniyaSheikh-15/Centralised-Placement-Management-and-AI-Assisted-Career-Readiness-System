"""Centralised logging configuration.

A single place to configure log formatting and levels keeps request/AI logs
consistent across the service and makes production log shipping predictable.
"""

from __future__ import annotations

import logging
import sys

_LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def configure_logging(level: str = "INFO") -> None:
    """Configure the root logger exactly once.

    Parameters
    ----------
    level:
        Case-insensitive logging level name (``"INFO"``, ``"DEBUG"`` ...).
    """
    root = logging.getLogger()
    # Avoid duplicate handlers when uvicorn reloads the app.
    if root.handlers:
        root.setLevel(level.upper())
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT))

    root.addHandler(handler)
    root.setLevel(level.upper())

    # Tame noisy third-party loggers so our own INFO lines stay visible.
    for noisy in ("httpx", "httpcore", "google_genai", "urllib3", "python_multipart"):
        logging.getLogger(noisy).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a module-scoped logger."""
    return logging.getLogger(name)
