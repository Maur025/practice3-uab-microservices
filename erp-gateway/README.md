# ERP Gateway

## Descripcion

Este modulo funciona como punto de entrada para centralizar el acceso a los demas microservicios del ERP. Expone una consulta propia para sucursales y actua como proxy hacia los servicios internos.

Encargado de la tabla:

- Sucursal

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

| Metodo | Ruta                             | Descripcion                                    |
| ------ | -------------------------------- | ---------------------------------------------- |
| GET    | `/api/organizaciones/sucursales` | Consulta las sucursales desde el gateway.      |
| ANY    | `/api/compras/*`                 | Reenvia solicitudes al servicio de compras.    |
| ANY    | `/api/personas/*`                | Reenvia solicitudes al servicio de personas.   |
| ANY    | `/api/inventarios/*`             | Reenvia solicitudes al servicio de inventario. |
| ANY    | `/api/ventas/*`                  | Reenvia solicitudes al servicio de ventas.     |
| ANY    | `/api/finanzas/*`                | Reenvia solicitudes al servicio de pagos.      |

## Variables de entorno

| Archivo        | Descripcion                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `.env.example` | Archivo de referencia para configurar el puerto del gateway, la conexion a MariaDB y el modo de redireccion (`DEV` o `PROD`). |

## Nota

El gateway puede apuntar a servicios locales en desarrollo o a nombres de servicio del entorno de contenedores segun `SERVER_REDIRECTION`.
