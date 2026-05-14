@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
cd /D "C:\Users\usuario\OneDrive - Dominion Global\Escritorio\Dashboard.md"
C:\Users\usuario\AppData\Local\Python\pythoncore-3.14-64\python.exe -u server.py > server_log.txt 2>&1
