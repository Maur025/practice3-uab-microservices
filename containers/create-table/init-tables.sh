#!/bin/bash
set -e

echo "Initializing database tables..."
docker exec -i market-system-db mariadb -u root -p'root123456' sistema_supermercado_db < sistema_supermercado.sql
echo "Database tables initialized successfully."

echo "Applying product batch migration (producto_lote)..."
docker exec -i market-system-db mariadb -u root -p'root123456' sistema_supermercado_db < 004-migrate-lotes.sql
echo "Migration applied successfully."