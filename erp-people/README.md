# ERP People

## Descripcion

Este modulo gestiona datos de personas dentro del sistema: clientes, proveedores y empleados. Ya tiene una API funcional y realiza conexion a MariaDB.

Encargado de las tablas:

- Empleado
- Cargo
- Cliente
- Proveedor
- Usuario

## Puerto

7802 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

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
GET /api/personas/clientes
GET /api/personas/proveedores
GET /api/personas/empleados
```

## Variables de entorno

| Archivo        | Descripcion                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `.env.example` | Plantilla con el puerto del servicio de personas y la conexion a MariaDB para clientes, proveedores y empleados. |

## Nota

Al iniciar, el modulo prepara una conexion a base de datos y usa variables de entorno para configurarse.
