@echo off
title HotelLemon - Push Fix to GitHub
echo ============================================================
echo   HotelLemon Staff Attendance System - Push Fix to GitHub
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/6] Cleaning up build folders to free up disk space...
if exist android\build rmdir /s /q android\build
if exist android\app\build rmdir /s /q android\app\build
if exist android\.jdk17 rmdir /s /q android\.jdk17

echo [2/6] Configuring Git user...
git config --global user.email "bdeepak.ssv@gmail.com"
git config --global user.name "bdeepakssv-del"

echo [2/5] Initializing Git repository...
git init

echo [3/5] Staging all updated files (vercel.json, build-vercel.js, package.json)...
git add -A

echo [4/5] Creating new commit...
git commit -m "Fix Vercel public directory build output"

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
    echo   SUCCESS! Pushed to GitHub Repository!
    echo   https://github.com/bdeepakssv-del/lemon-Attendance-
    echo ============================================================
)
pause
