@echo off
echo 🚀 Starting LANverse PWA HTTPS Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Start HTTPS server
python start-https.py

pause 