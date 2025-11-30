@echo off
title Backend
cd /d %~dp0
pnpm --filter api run start:dev
pause
