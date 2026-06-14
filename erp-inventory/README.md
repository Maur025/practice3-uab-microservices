# ERP Inventory

## Descripcion

Modulo encargado del inventario del sistema. Su configuracion esta pensada para exponer una API propia y trabajar con MariaDB.

Encargado de las tablas:

- Inventario
- Producto
- Unidad medida
- Categoria
- Movimiento inventario

## Puerto

7803 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

## Comandos disponibles

```bash
pnpm dev
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## Rutas expuestas

```http
GET /api/inventarios/catalogo/productos
```

## Variables de entorno

| Archivo        | Descripcion                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| `.env.example` | Plantilla con el puerto del servicio de inventario y los datos basicos de acceso a MariaDB. |

## Nota

Este modulo esta preparado para crecer como servicio dedicado a productos, existencias y movimientos de stock.
