Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting FastAPI Backend and Next.js Frontend..." -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }

# Start Backend in a background process / window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir'; Write-Host 'FastAPI Backend running on http://127.0.0.1:8000' -ForegroundColor Green; & '$rootDir\.venv\Scripts\python.exe' -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000"

# Start Frontend in current console
Set-Location "$rootDir\frontend\Authentication"
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
node .\node_modules\next\dist\bin\next dev -p 3000
