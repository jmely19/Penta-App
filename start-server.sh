#!/bin/bash
echo "Iniciando servidor local para PENTA..."
echo ""
echo "Navegando a la carpeta docs..."
cd docs
echo ""
echo "Iniciando servidor en http://localhost:8000"
echo "Presiona Ctrl+C para detener el servidor"
echo ""
python3 -m http.server 8000
