@echo off
title Project Controller
:MENU
cls
echo ==============================
echo  2DVanProj - Control Script
echo ==============================
echo 1. Nettoyer dist et Lancer Backend + Frontend
echo 2. Stopper Backend + Frontend
echo 3. Quitter
echo ==============================
set /p choice=Choix (1-3): 

if "%choice%"=="1" goto START
if "%choice%"=="2" goto STOP
if "%choice%"=="3" exit

:START
echo Suppression du dossier dist...
powershell -Command "Remove-Item -Recurse -Force .\apps\api\dist\*"

echo Lancement du Backend...
start "Backend" cmd /c backend.cmd

echo Lancement du Frontend...
start "Frontend" cmd /c frontend.cmd

pause
goto MENU

:STOP
echo Arret du Backend et du Frontend...
taskkill /FI "WINDOWTITLE eq Backend*" /T /F
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F
echo Processus stopped.
pause
goto MENU
