@echo off
title HotelLemon - Build Android APK
echo ============================================================
echo   HotelLemon Staff Attendance System - Building Android APK
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking / Installing Node dependencies (npm install)...
call npm install
if %errorlevel% neq 0 (
echo [ERROR] npm install failed. Please check Node.js and internet connection.
pause
exit /b %errorlevel%
)

echo.
echo [2/3] Preparing Capacitor config and syncing native assets...
if exist capacitor.config.ts del capacitor.config.ts
call npx cap sync android
if %errorlevel% neq 0 (
echo [ERROR] Capacitor sync failed. Please make sure node and npx are installed.
pause
exit /b %errorlevel%
)

echo.
echo [3/3] Preparing Java 17 and building Android Debug APK with Gradle...
if not exist "%~dp0android\.jdk17\bin\java.exe" (
    echo [INFO] Downloading portable OpenJDK 17 for Gradle compatibility...
    C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command "Invoke-WebRequest -Uri 'https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse' -OutFile '%~dp0android\jdk17.zip'"
    echo [INFO] Extracting OpenJDK 17...
    C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command "Expand-Archive -Path '%~dp0android\jdk17.zip' -DestinationPath '%~dp0android\jdk17_temp' -Force"
    for /d %%D in ("%~dp0android\jdk17_temp\*") do move "%%D" "%~dp0android\.jdk17"
    rd /s /q "%~dp0android\jdk17_temp"
    del "%~dp0android\jdk17.zip"
    echo [INFO] JDK 17 setup complete.
)

set "JAVA_HOME=%~dp0android\.jdk17"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\Hp\AppData\Local\Android\Sdk"
set "ANDROID_SDK_ROOT=C:\Users\Hp\AppData\Local\Android\Sdk"

cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
echo [ERROR] Gradle build failed. Please check Android SDK configuration.
pause
exit /b %errorlevel%
)

echo.
echo ============================================================
echo   SUCCESS! Android APK Generated Successfully!
echo ============================================================
echo   Generated APK location:
echo   "%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
echo ============================================================
echo.
%SystemRoot%\explorer.exe /select,"%~dp0android\app\build\outputs\apk\debug\app-debug.apk"
pause
