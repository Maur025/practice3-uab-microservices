# ERP Inventory

## Descripcion

Modulo encargado del inventario del sistema. Su API actual expone consultas de catalogo de productos y trabaja con MariaDB.

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

| Metodo | Ruta                                  | Descripcion                                              |
| ------ | ------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/inventarios/catalogo/productos` | Lista el catalogo de productos disponible en inventario. |

## Variables de entorno

| Archivo        | Descripcion                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| `.env.example` | Plantilla con el puerto del servicio de inventario y los datos basicos de acceso a MariaDB. |

## Nota

Este modulo esta orientado al catalogo de productos, existencias y movimientos de stock.
