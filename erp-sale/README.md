# ERP Sale

## Descripcion

Modulo orientado al ciclo de ventas del sistema. Su configuracion esta pensada para exponer una API propia y trabajar con MariaDB.

Encargado de las tablas:

- Venta
- Detalle venta
- Factura
- Detalle factura

## Puerto

7804 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

## Comandos disponibles

```bash
pnpm dev
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## Variables de entorno

| Archivo        | Descripcion                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| `.env.example` | Plantilla con el puerto del servicio de ventas y los datos basicos para acceder a MariaDB. |

## Nota

Este modulo esta pensado para manejar ventas, facturacion y el registro de operaciones comerciales.
