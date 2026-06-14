# ERP Purchase

## Descripcion

Modulo orientado al flujo de compras del sistema. Su API actual permite listar compras y esta conectada a MariaDB.

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

## Rutas expuestas

| Metodo | Ruta                   | Descripcion                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/api/compras/compras` | Lista las compras registradas. |

## Variables de entorno

| Archivo        | Descripcion                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `.env.example` | Archivo de referencia con el puerto del modulo de compras y los parametros de acceso a la base de datos. |

## Nota

Este modulo puede utilizarse para registrar solicitudes, pedidos y procesos de reposicion.
