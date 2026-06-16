#!/bin/sh
set -e

echo "Ejecutando migraciones..."
NODE_ENV=production npx sequelize-cli db:migrate

echo "Ejecutando seeders..."
NODE_ENV=production npx sequelize-cli db:seed:all || echo "Seeders ya aplicados o error no crítico"

echo "Iniciando erp-people..."
exec npm start
