@echo off
title HotelLemon - Run Web Locally
echo ============================================================
echo   HotelLemon Staff Attendance System - Local Web Server
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting local web server on port 8000...
echo.
echo   Local Web Access URLs:
echo   - Home / Login:  http://localhost:8000/
echo   - Admin Panel:   http://localhost:8000/admin.html
echo   - Staff Portal:  http://localhost:8000/staff.html
echo.

echo [2/2] Opening browser at http://localhost:8000/ ...
start http://localhost:8000/

echo.
call npx serve . -p 8000
if %errorlevel% neq 0 (
    echo [INFO] Fallback to python http.server...
    python -m http.server 8000
)
pause
