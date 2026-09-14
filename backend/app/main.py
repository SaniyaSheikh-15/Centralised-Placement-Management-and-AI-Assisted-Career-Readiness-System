from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router


app = FastAPI(
    title="Centralised Placement Management API",
    description=(
        "Backend APIs for the Placement Management "
        "and AI-Assisted Career Readiness System"
    ),
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTES
# =========================================================

app.include_router(analytics_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Centralised Placement Management API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }