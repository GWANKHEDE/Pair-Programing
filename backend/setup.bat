@echo off
echo ========================================
echo Pair Programming App - Setup Script
echo ========================================
echo.

echo [1/4] Creating PostgreSQL database...
python setup_db.py
if errorlevel 1 (
    echo.
    echo ERROR: Database setup failed!
    echo Please ensure PostgreSQL is installed and running.
    pause
    exit /b 1
)

echo.
echo [2/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [3/4] Creating database tables...
echo Tables will be created automatically when the server starts.

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo To start the backend server, run:
echo   uvicorn app.main:app --reload
echo ========================================
pause
