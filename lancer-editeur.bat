@echo off
chcp 65001 > nul
title Editeur LHEO / EDOF

:: Vérifier si le serveur tourne déjà
curl -s http://localhost:8765/ping > nul 2>&1
if %errorlevel% == 0 (
    echo Serveur deja actif, ouverture du navigateur...
    start http://localhost:8765/editeur-lheo-edof.html
    exit
)

:: Lancer le serveur Python
echo Lancement du serveur proxy...
python lancer-editeur.py
pause
