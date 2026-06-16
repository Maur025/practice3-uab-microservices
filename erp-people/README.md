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

| Metodo | Ruta                            | Descripcion                             |
| ------ | ------------------------------- | --------------------------------------- |
| GET    | `/health`                       | Verifica que el servicio este en linea. |
| GET    | `/api/personas/clientes`        | Lista todos los clientes.               |
| GET    | `/api/personas/clientes/:id`    | Obtiene un cliente por id.              |
| POST   | `/api/personas/clientes`        | Crea un cliente.                        |
| PUT    | `/api/personas/clientes/:id`    | Actualiza un cliente.                   |
| DELETE | `/api/personas/clientes/:id`    | Desactiva un cliente.                   |
| GET    | `/api/personas/proveedores`     | Lista todos los proveedores.            |
| GET    | `/api/personas/proveedores/:id` | Obtiene un proveedor por id.            |
| POST   | `/api/personas/proveedores`     | Crea un proveedor.                      |
| PUT    | `/api/personas/proveedores/:id` | Actualiza un proveedor.                 |
| DELETE | `/api/personas/proveedores/:id` | Desactiva un proveedor.                 |
| GET    | `/api/personas/cargos`          | Lista todos los cargos.                 |
| GET    | `/api/personas/cargos/:id`      | Obtiene un cargo por id.                |
| POST   | `/api/personas/cargos`          | Crea un cargo.                          |
| PUT    | `/api/personas/cargos/:id`      | Actualiza un cargo.                     |
| DELETE | `/api/personas/cargos/:id`      | Elimina un cargo.                       |
| GET    | `/api/personas/empleados`       | Lista todos los empleados.              |
| GET    | `/api/personas/empleados/:id`   | Obtiene un empleado por id.             |
| POST   | `/api/personas/empleados`       | Crea un empleado.                       |
| PUT    | `/api/personas/empleados/:id`   | Actualiza un empleado.                  |
| DELETE | `/api/personas/empleados/:id`   | Desactiva un empleado.                  |
| GET    | `/api/personas/usuarios`        | Lista todos los usuarios.               |
| GET    | `/api/personas/usuarios/:id`    | Obtiene un usuario por id.              |
| POST   | `/api/personas/usuarios`        | Crea un usuario.                        |
| PUT    | `/api/personas/usuarios/:id`    | Actualiza un usuario.                   |
| DELETE | `/api/personas/usuarios/:id`    | Desactiva un usuario.                   |

## Variables de entorno

| Archivo        | Descripcion                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `.env.example` | Plantilla con el puerto del servicio de personas y la conexion a MariaDB.                                |
| `INSTANCE_ID`  | Identificador opcional para distinguir procesos o despliegues cuando el servicio se ejecuta en paralelo. |

## Nota

Al iniciar, el modulo prepara una conexion a base de datos, usa variables de entorno para configurarse y registra `INSTANCE_ID` si esta definido.
