@echo off
echo Starting Ozkafe Specialty Coffee Roastery Website...
cd /d "%~dp0"
start http://localhost:5173/
npm run dev
