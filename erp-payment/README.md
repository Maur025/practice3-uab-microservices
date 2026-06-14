# ERP Payment

## Descripcion

Modulo pensado para la gestion de pagos del sistema. Su configuracion esta lista para servir una API propia y acceder a MariaDB.

Encargado de las tablas:

- Cuentas por pagar
- Pago proveedor
- Cuentas por cobrar
- Pago cliente

## Puerto

7805 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

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
GET /api/finanzas/cuentas-por-cobrar
GET /api/finanzas/cuentas-por-pagar
GET /api/finanzas/pagos-proveedores
GET /api/finanzas/pagos-clientes
```

## Variables de entorno

| Archivo        | Descripcion                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `.env.example` | Base de configuracion con el puerto del servicio de pagos y los valores necesarios para conectarse a la base de datos. |

## Nota

Este modulo puede utilizarse para procesar cobros, registrar transacciones y coordinar integraciones con otros servicios.
