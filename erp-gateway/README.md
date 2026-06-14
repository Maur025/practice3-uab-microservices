# ERP Gateway

## Descripcion

Este modulo funciona como punto de entrada para centralizar el acceso a los demas microservicios del ERP. Su entorno esta preparado para correr como servicio HTTP y conectarse a MariaDB.

Encargado de las tablas:

- Sucursal

Encargado de manejar y coordinar la comunicación entre todos los servicios

## Puerto

7800 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

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
GET /api/organizaciones/sucursales
```

## Variables de entorno

| Archivo        | Descripcion                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `.env.example` | Archivo de referencia para configurar el puerto del gateway y la conexion a MariaDB antes de ejecutar el servicio. |

## Nota

Cuando se implemente la logica del gateway, este modulo podra actuar como capa de entrada unificada para consumir los servicios de negocio.
