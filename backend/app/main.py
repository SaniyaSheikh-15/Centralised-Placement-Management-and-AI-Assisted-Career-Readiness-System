from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

import backend.app.models  # noqa: F401
from backend.app.api import auth
from backend.app.db.base import Base
from backend.app.db.session import SessionLocal, engine, get_db
from backend.app.repositories.role_repository import RoleRepository


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)

    # Ensure default roles exist in DB
    with SessionLocal() as db:
        try:
            RoleRepository.ensure_default_roles(db)
            db.commit()
        except Exception:
            db.rollback()

    yield


app = FastAPI(
    title="Centralised Placement Management & AI-Assisted Career Readiness System",
    version="1.0.0",
    description="Backend API for the placement management and career readiness platform.",
    lifespan=lifespan,
)

app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "Placement Management API is running",
        "status": "ok",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.get("/health/database")
def database_health_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
        "result": result.scalar(),
    }