@echo off
echo Stopping server...
taskkill /F /IM node.exe /T 2>nul

echo.
echo Regenerating Prisma Client...
call npx prisma generate

echo.
echo Starting server...
call npm run start:dev
