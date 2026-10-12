@echo off
title CampusConnect Auth Launcher
echo ===================================================
echo Starting FastAPI Backend and Next.js Frontend...
echo ===================================================

:: Start FastAPI Backend in a new window
start "FastAPI Backend (Port 8000)" cmd /k "title FastAPI Backend && .venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

:: Start Next.js Frontend in the current window
cd frontend\Authentication
echo Starting Next.js Dev Server on http://localhost:3000...
node .\node_modules\next\dist\bin\next dev -p 3000
