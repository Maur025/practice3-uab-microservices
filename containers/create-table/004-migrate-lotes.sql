-- Migration: Add producto_lote table and populate from existing inventario/movimiento data
-- Run: docker exec -i market-system-db mariadb -u root -p'root123456' sistema_supermercado_db < 004-migrate-lotes.sql

USE sistema_supermercado_db;

CREATE TABLE IF NOT EXISTS `producto_lote` (
  `id_lote` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '0.00',
  `costo_unitario` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `origen` varchar(50) DEFAULT 'INICIAL',
  `referencia` varchar(100) DEFAULT NULL,
  `fecha_ingreso` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_lote`),
  KEY `fk_lote_producto` (`id_producto`),
  KEY `fk_lote_sucursal` (`id_sucursal`),
  CONSTRAINT `fk_lote_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_lote_sucursal` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal` (`id_sucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Populate from existing inventario data
INSERT INTO producto_lote (id_producto, id_sucursal, cantidad, costo_unitario, precio_venta, origen, referencia)
SELECT i.id_producto, i.id_sucursal, i.stock_actual, p.costo, p.precio_venta, 'MIGRACION', 'Migracion desde inventario existente'
FROM inventario i
JOIN producto p ON i.id_producto = p.id_producto
WHERE i.stock_actual > 0;

-- Add costo_promedio column to inventario (optional, computed from lotes)
-- ALTER TABLE inventario ADD COLUMN costo_promedio DECIMAL(10,2) DEFAULT NULL AFTER stock_minimo;
