import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

import backend.app.models  # noqa: F401
from backend.app.api import auth, student
from backend.app.db.session import SessionLocal, get_db
from backend.app.repositories.role_repository import RoleRepository


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure default roles exist in the existing database
    with SessionLocal() as db:
        try:
            RoleRepository.ensure_default_roles(db)
            db.commit()
        except Exception:
            db.rollback()
            raise

    yield


app = FastAPI(
    title="Centralised Placement Management & AI-Assisted Career Readiness System",
    version="1.0.0",
    description="Backend API for the placement management and career readiness platform.",
    lifespan=lifespan,
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,"
    "http://localhost:3001,http://127.0.0.1:3001",
)

allowed_origins = [
    origin.strip()
    for origin in raw_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTERS
# ============================================================

app.include_router(auth.router)
app.include_router(student.router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Placement Management API is running",
        "status": "ok",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


# ============================================================
# DATABASE HEALTH CHECK
# ============================================================

@app.get("/health/database")
def database_health_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
        "result": result.scalar(),
    }