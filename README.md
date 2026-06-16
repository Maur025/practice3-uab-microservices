# ERP Prototype

Este proyecto es un monorepositorio de microservicios orientado a un sistema tipo ERP/supermercado. La idea general es separar responsabilidades por dominio para que cada servicio evolucione de forma independiente, pero manteniendo una base común para comunicación, base de datos y despliegue local.

## Estructura general

El repositorio está organizado por servicios y soporte de infraestructura:

- `erp-gateway`: puerta de entrada principal para centralizar el acceso a los servicios.
- `erp-people`: servicio relacionado con personas, clientes, empleados y proveedores.
- `erp-inventory`: servicio de inventario.
- `erp-purchase`: servicio de compras.
- `erp-sale`: servicio de ventas.
- `erp-payment`: servicio de pagos.
- `containers/`: scripts y configuración para levantar la base de datos y apoyar el entorno local.

Cada servicio tiene su propio `package.json`, su configuración de lint y su ciclo de ejecución, lo que facilita trabajar de forma aislada en cada microservicio.

## Swagger Documentation

swagger expose in next endpoints

| Route                                           | Description                |
| ----------------------------------------------- | -------------------------- |
| `http://localhost:7800/api/organizaciones/docs` | Organization documentation |
| `http://localhost:7800/api/inventarios/docs`    | Inventory documentation    |
| `http://localhost:7800/api/finanzas/docs`       | Payment documentation      |
| `http://localhost:7800/api/personas/docs`       | People documentation       |
| `http://localhost:7800/api/compras/docs`        | Purchase documentation     |
| `http://localhost:7800/api/ventas/docs`         | Sale documentation         |

## Puertos por modulo

| Modulo          | Puerto |
| --------------- | ------ |
| `erp-gateway`   | `7800` |
| `erp-purchase`  | `7801` |
| `erp-people`    | `7802` |
| `erp-inventory` | `7803` |
| `erp-sale`      | `7804` |
| `erp-payment`   | `7805` |

## Gateway y endpoints

El gateway corre en `7800` y centraliza el acceso a los microservicios. Además de una consulta propia para sucursales, puede reenviar solicitudes hacia los servicios internos usando los prefijos que se muestran abajo.

| Ruta                                 | Tipo    | Descripcion                                    |
| ------------------------------------ | ------- | ---------------------------------------------- |
| `GET /api/organizaciones/sucursales` | Directa | Consulta las sucursales desde el gateway.      |
| `/api/personas/*`                    | Proxy   | Reenvia solicitudes al servicio de personas.   |
| `/api/compras/*`                     | Proxy   | Reenvia solicitudes al servicio de compras.    |
| `/api/inventarios/*`                 | Proxy   | Reenvia solicitudes al servicio de inventario. |
| `/api/ventas/*`                      | Proxy   | Reenvia solicitudes al servicio de ventas.     |
| `/api/finanzas/*`                    | Proxy   | Reenvia solicitudes al servicio de pagos.      |

Los prefijos proxyados aceptan los metodos que soporte cada servicio destino.

En el servicio de personas tambien existe el endpoint `GET /health`, que se usa para validar el estado del servicio de forma directa.

## Tecnologías principales

El stack actual combina varias piezas conocidas:

- Node.js como runtime.
- Express para exponer APIs HTTP.
- MariaDB como motor de base de datos.
- `mysql2` para la comunicación con la base de datos.
- `dotenv` para la gestión de variables de entorno.
- `cors` y `compression` para aspectos comunes de una API.
- ESLint para mantener consistencia en el código.
- Jest para pruebas automatizadas en los servicios que lo incluyen.

## Uso de pnpm

El monorepositorio está pensado para trabajar con pnpm. Esto ayuda a:

- gestionar dependencias de manera eficiente;
- mantener instalaciones rápidas;
- compartir un flujo de trabajo similar entre servicios;
- conservar el bloqueo de versiones en cada proyecto.

En la práctica, cada microservicio puede instalar y ejecutar sus dependencias de forma independiente, respetando su propio `package.json` y su archivo de bloqueo.

## Contenedores

La carpeta `containers/` reúne la parte de infraestructura local. En particular, se utiliza un contenedor de MariaDB para levantar la base de datos del sistema y scripts de inicialización para cargar usuarios, estructura o datos base.

El archivo de `docker-compose` define un servicio de base de datos con persistencia mediante volúmenes y una red compartida para conectar otros contenedores o servicios del entorno.

## Flujo de trabajo esperado

La forma habitual de trabajar en este repositorio es:

1. Levantar la base de datos con los contenedores disponibles.
2. Instalar dependencias en el microservicio que se quiera modificar.
3. Ejecutar ese servicio en modo desarrollo.
4. Probar los cambios con lint y tests cuando aplique.

## Idea de arquitectura

La separación por microservicios permite dividir el sistema por contexto funcional. En lugar de concentrar toda la lógica en una sola aplicación, cada dominio puede manejar su propia API, sus modelos y su interacción con la base de datos, reduciendo acoplamiento y facilitando el mantenimiento.

## Notas

- Este repositorio está en fase de prototipo, por lo que la estructura puede crecer o ajustarse con el tiempo.
- La documentación puede ampliarse con comandos concretos de arranque, variables de entorno y ejemplos de peticiones cuando el proyecto se consolide.
