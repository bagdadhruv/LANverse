# LANverse PWA HTTPS Server
Write-Host "🚀 Starting LANverse PWA HTTPS Server..." -ForegroundColor Green
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python from https://python.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Start HTTPS server
Write-Host "🔐 Starting HTTPS server on https://localhost:8443" -ForegroundColor Cyan
python start-https.py

Read-Host "Press Enter to exit" 