@echo off
echo.
echo  ╔═══════════════════════════════════════╗
echo  ║   Jeremías Gutiérrez — Portfolio      ║
echo  ║   Iniciando servidor local...         ║
echo  ╚═══════════════════════════════════════╝
echo.

:: Verificar si Node está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Instalalo desde https://nodejs.org
    pause
    exit
)

echo  Servidor corriendo en: http://localhost:3001
echo  Presiona Ctrl+C para detener.
echo.

:: Abrir el navegador después de 1.5 segundos
start /b cmd /c "timeout /t 2 >nul && start http://localhost:3001"

:: Iniciar servidor con npx serve (zero install)
npx --yes serve -p 3001 .

pause
