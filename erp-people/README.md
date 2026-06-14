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

| Metodo | Ruta                        | Descripcion                             |
| ------ | --------------------------- | --------------------------------------- |
| GET    | `/health`                   | Verifica que el servicio este en linea. |
| GET    | `/api/personas/clientes`    | Lista todos los clientes.               |
| GET    | `/api/personas/proveedores` | Lista todos los proveedores.            |
| GET    | `/api/personas/empleados`   | Lista todos los empleados.              |

## Variables de entorno

| Archivo        | Descripcion                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `.env.example` | Plantilla con el puerto del servicio de personas y la conexion a MariaDB.                                |
| `INSTANCE_ID`  | Identificador opcional para distinguir procesos o despliegues cuando el servicio se ejecuta en paralelo. |

## Nota

Al iniciar, el modulo prepara una conexion a base de datos, usa variables de entorno para configurarse y registra `INSTANCE_ID` si esta definido.
