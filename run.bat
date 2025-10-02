@echo off
start cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 5000"
timeout /t 2 /nobreak > nul
start cmd /k "cd frontend && npm run dev"