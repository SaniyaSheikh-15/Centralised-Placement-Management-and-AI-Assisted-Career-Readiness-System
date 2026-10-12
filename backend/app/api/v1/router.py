"""Aggregate router for API v1.

Mounts the authentication, interview and assistant routers under the single
``/api/v1`` prefix declared in settings, keeping ``main.py`` tidy.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import assistant, auth, interviews

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(interviews.router)
api_router.include_router(assistant.router)
