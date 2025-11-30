@echo off
title Frontend
cd /d %~dp0
pnpm --filter web run dev
pause
