# ERP Purchase

## Descripcion

Modulo orientado al flujo de compras del sistema. Su configuracion esta preparada para levantar una API propia y conectarse a MariaDB.

Encargado de las tablas:

- Compra
- Detalle compra

## Puerto

7801 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

## Comandos disponibles

```bash
pnpm dev
pnpm start
pnpm lint
pnpm test
pnpm test:watch
```

## Variables de entorno

| Archivo        | Descripcion                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `.env.example` | Archivo de referencia con el puerto del modulo de compras y los parametros de acceso a la base de datos. |

## Nota

Este modulo puede utilizarse para registrar solicitudes, pedidos y procesos de reposicion.
