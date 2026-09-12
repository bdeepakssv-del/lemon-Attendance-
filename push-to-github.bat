@echo off
title HotelLemon - Push to GitHub
echo ============================================================
echo   HotelLemon Staff Attendance System - Push to GitHub
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/5] Configuring Git user...
git config --global user.email "bdeepak.ssv@gmail.com"
git config --global user.name "bdeepakssv-del"

echo [2/5] Initializing Git repository...
git init

echo [3/5] Staging files...
git add .

echo [4/5] Creating commit...
git commit -m "HotelLemon v2.0 Release"

echo [5/5] Pushing to GitHub (https://github.com/bdeepakssv-del/lemon-Attendance-.git)...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/bdeepakssv-del/lemon-Attendance-.git
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [NOTE] If GitHub asks for login in browser, please sign in.
) else (
    echo.
    echo ============================================================
    echo   SUCCESS! Pushed to GitHub Repository:
    echo   https://github.com/bdeepakssv-del/lemon-Attendance-
    echo ============================================================
)
pause
