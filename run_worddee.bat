@echo off
echo Starting Worddee AI...

start "Backend API" cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"

start "Frontend Web" cmd /k "cd frontend && npm run dev"

timeout /t 5
start http://localhost:3000

echo Done! Happy Learning.