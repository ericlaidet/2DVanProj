@echo off
set /p msg=Message du commit : 

git status
git add .
git commit -m "%msg%"
git push

pause

