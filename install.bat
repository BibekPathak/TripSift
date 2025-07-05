@echo off
echo Installing Ride Aggregator...
echo.

echo Installing root dependencies...
npm install

echo.
echo Installing server dependencies...
cd server
npm install

echo.
echo Installing client dependencies...
cd ../client
npm install

echo.
echo Installation complete!
echo.
echo To start the application, run:
echo npm run dev
echo.
echo This will start both the backend (port 5000) and frontend (port 3000)
echo.
pause 