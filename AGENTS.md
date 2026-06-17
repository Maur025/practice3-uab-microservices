# ERP Supermercado — Microservicios (Backend)

## Arquitectura

Monorepo con 6 microservicios Node.js + Express 5 que comparten una misma base de datos MariaDB.

```
practice3-uab-microservices/
├── erp-gateway/          # API Gateway (puerto 7800)
├── erp-purchase/         # Compras (puerto 7801)
├── erp-people/           # Personas, clientes, empleados, usuarios (puerto 7802)
├── erp-inventory/        # Inventario y catálogo de productos (puerto 7803)
├── erp-sale/             # Ventas y facturación (puerto 7804)
├── erp-payment/          # Finanzas, cuentas por cobrar/pagar (puerto 7805)
├── containers/           # MariaDB + schema SQL
├── init-services.sh      # Copia .env y hace pnpm install en cada servicio
└── build-to-minikube.sh  # Build de imágenes Docker para Minikube
```

## Tech Stack

- **Runtime:** Node.js >= 24.0.0
- **Framework:** Express 5 (ES Modules, `"type": "module"`)
- **DB:** MariaDB vía `mysql2/promise` (connection pool, 10 conexiones)
- **Gateway proxy:** `http-proxy-middleware`
- **Validación:** `express-validator`
- **Logging:** `@maur025/core-logger`
- **Documentación:** Swagger UI (`/{apiPrefix}/docs`)
- **Testing:** Jest
- **Linting:** ESLint con `@eslint/js`
- **Paquetería:** pnpm

## Inicio rápido

```bash
# 1. Levantar MariaDB
cd containers/mariadb && docker compose up -d

# 2. Crear tablas y seed data
cd ../create-table && bash init-tables.sh

# 3. Inicializar servicios (copia .env + pnpm install)
cd ../.. && bash init-services.sh

# 4. Iniciar cada servicio (6 terminales o con un gestor de procesos)
cd erp-gateway     && pnpm dev   # puerto 7800
cd erp-people      && pnpm dev   # puerto 7802
cd erp-inventory   && pnpm dev   # puerto 7803
cd erp-purchase    && pnpm dev   # puerto 7801
cd erp-sale        && pnpm dev   # puerto 7804
cd erp-payment     && pnpm dev   # puerto 7805
```

## Gateway — Rutas de proxy

| Ruta gateway                         | Destino                     | Puerto |
| ------------------------------------ | --------------------------- | ------ |
| `GET /api/organizaciones/sucursales` | Directo (branch.controller) | 7800   |
| `/api/personas/*`                    | people-service              | 7802   |
| `/api/compras/*`                     | purchase-service            | 7801   |
| `/api/inventarios/*`                 | inventory-service           | 7803   |
| `/api/ventas/*`                      | sale-service                | 7804   |
| `/api/finanzas/*`                    | payment-service             | 7805   |

Swagger: `http://localhost:7800/api/organizaciones/docs`

## Estructura de cada microservicio

```
erp-{name}/
├── src/
│   ├── index.js            # Entry point (Express app, middleware, listener)
│   ├── env.js              # Variables de entorno con defaults
│   ├── db.js               # Pool de conexión MySQL2
│   ├── swagger.js          # Especificación OpenAPI
│   ├── routes/
│   │   └── api.routes.js   # Definición de rutas Express
│   ├── controllers/        # Handlers que llaman a servicios
│   └── services/           # Lógica de negocio y queries SQL
├── .env.example
├── Dockerfile
├── eslint.config.js
└── package.json
```

Excepción: `erp-people` tiene una estructura más compleja con `middlewares/`, `validators/`, `utils/` y sub-routers.

## Convenciones de código

- ES Modules (`import`/`export`)
- `apiPrefix` consistente con la ruta del gateway (ej: `/api/personas`)
- Controladores delgados → toda la lógica en servicios
- Servicios usan `db.query()` o `connection.query()` con transacciones vía `beginTransaction`/`commit`/`rollback`
- Las respuestas son `res.json(data)` o `res.status(500).json({ error: message })`
- Variables de entorno con `dotenv/config`, leídas desde `env.js`
- Swagger se sirve en `/{apiPrefix}/docs` con spec en `/{apiPrefix}/openapi.json`

## Servicios con lógica transaccional

- **`erp-sale/src/services/sale.service.js`**: `registerSale` — crea venta + detalle_venta + factura + detalle_factura + (opcional) llama a payment para CxC
- **`erp-payment/src/services/collection.service.js`**: `registerCollection` — pago de cliente con `SELECT ... FOR UPDATE`, valida saldo, actualiza cuenta

## Variables de entorno compartidas

| Variable             | Default                 | Descripción                              |
| -------------------- | ----------------------- | ---------------------------------------- |
| `SERVER_APP_PORT`    | 7800-7805               | Puerto del servicio                      |
| `DB_HOST`            | localhost               | Host MariaDB                             |
| `DB_PORT`            | 3306                    | Puerto MariaDB                           |
| `DB_USER`            | root                    | Usuario DB                               |
| `DB_PASSWORD`        | root123456              | Password DB                              |
| `DB_NAME`            | sistema_supermercado_db | Nombre DB                                |
| `SERVER_REDIRECTION` | DEV                     | Gateway: DEV/PROD para targets del proxy |
| `INSTANCE_ID`        | —                       | People service (opcional)                |

## Testing

```bash
pnpm test        # Jest
pnpm test:watch  # Jest en modo watch
pnpm lint        # ESLint
```

## CI/CD (GitHub Actions)

Cada microservicio tiene su propio workflow (`.github/workflows/ci-{name}.yml`):

- Trigger: push/PR a `main` o `develop` con path filter del servicio
- Steps: checkout → pnpm install → lint → test

## GIT

Toda la carpeta `practice3-uab-microservices` tiene su propio repositorio, el frontend tiene el suyo por su cuenta.

# Requisitos de usuario

1. Se debe registrar un supermercado(empresa) en cualquier momento, lo que significa que debe existir una distinción para su dominio de datos.
2. Cada empresa como tal puede tener n numero de sucursales relacionadas directamente, lo que significa que si los datos de los demás microservicios no se dividen por empresa, se dividiran por sucursales lo cual podria mejorar la granularidad.
3. El modulo de inventarios debe manejar correctamente su stock, productos, unidades, etc. en los productos existe algo que puede incrementar a complejo lo cual es la presentación del producto, ejemplo coca cola producto, presentaciones botella retornable, six pack, personal, etc. para no complicarnos cada producto como tal representara conjuntamente la presentación, ejemplo producto coca cola six pack, coca cola retornable, etc. los precios quiero que se manejen los necesarios, pero en una etapa inicial quiero que mantengamos el precio de venta, y agregues el precio base ...el cual pertenece solamente a inventarios, creo que una forma de denominarlo es costo, no debemos olvidar que un producto puede existir globalmente para toda la empresa, pero los stocks se maneja por sucursal, para eso requiero que se manejen los movimientos correctamente.
4. Inicialización de stocks existentes por sucursal, si nos ponemos en los zapatos del usuario, no comenzará a comprar/vender productos desde que le entreguemos el sistema, lo que significa que en algun momento ya compro productos para sucursales y como ya los tiene, debe existir una manera sencilla de agregarlos al sistema, generalmente lo llamo iniciar stocks, pero el nombre puede variar según la interpretación.
5. Transferencia de stocks entre sucursales, lo que significa que necesitamos agregar estados en los movimientos? ... posiblemente con los mismo movimientos de inventario se cubra esa solicitud, algo que si seria interesante añadir ... seria un historial de transferencias, donde registremos las sucursales involucradas, el o los productos involucrados y por ultimo las cantidades que fueron movidas, seria interesante simular la transferencia completa, por ejemplo con los estados despachando productos, en progreso, y confirmación de recepción, pero no nos centraremos en eso, debe hacer el movimiento y con eso tenemos cubierto este requerimiento.
6. Venta de productos a clientes, tomando en cuenta que para la facturación se debe hacer un screenshoot de los precios, cliente, stock, unidad, etc involucrado en la venta, para que no cambie en el tiempo y siempre se pueda replicar la misma factura.
7. Facturación simulada para las ventas, al ser un prototipo, no existe una razón real para concentrarse en comunicarse con impuesto o algo similar. Lo ideal en este caso, generar un pdf con los detalles registrados en la tabla factura de venta, replicable en cualquier momento, retornando un content type pdf, no quiero nada de base 64 o algo similar, para que el frontend pueda representarlo rápidamente y sin problemas.
8. El usuario requiere estadísticas para la fidelización de clientes, por ejemplo requiere guardar información sobre el cliente, ¿donde compra?, ¿que compra?, frecuencia de compras, cuanto gasta, etc. debemos mantener esos datos por sucursal, para responder a la pregunta de "El cliente x con que frecuencia visita la sucursal A y cual es el producto que mas consume", también debe realizarse a nivel empresa, para responder a la pregunta "en que empresa/supermercado compra con mas frecuencia el cliente x" para este ultimo nos podemos ayudar del document o ci del cliente, ya que en la practica seria el mismo ... por que se entiende que cada empresa mantiene su propio registro de clientes.
9. Necesitamos el siguiente reporte "Obtener saldo total disponible del producto x por empresa", entendiendo que saldo se refiere a el stock sobrante o el disponible a vender, y por empresa entendiendo que sin importar la sucursal debemos tener la suma total. agruparlo por sucursales seria optimo y ayudaría visualmente al usuario.
10. Necesitamos otro reporte el cual responda a "Conocer el monto total de ingresos obtenidos en 1 dia", ya que podría ser facilmente por dia, semana, mes ... podemos hacerlo por la marcha, podemos agregar un filtro extra para sucursales, si no selecciona el total se calcula de todas las ventas realizadas en un dia en concreto, debemos tomar en cuenta que usar dia en 00:00 a dia en 23:59 puede ser mas efectivo que solo utilizar la fecha como tal

Debemos centrarnos en hacer funcional ese flujo, tomando en cuenta que reportes necesitara un pdf como mínimo para ser considerado un reporte, content-type: pdf para facilitar la integración, ya que la mayor complejidad y el nucleo de ventas se centra en el modulo de inventarios, considero que es una buena idea seguir este orden en el desarrollo:

1. Modulo empresa
2. Modulo inventarios
3. Modulo de ventas
4. Modulo reportes
5. Modulo pagos

ALgunos no existen y otros si pero tiene nombre en ingles siendo erp-inventory, erp-sale, erp-payment, lo otros no existen asi que debemos agregarlos basado en los otros, la lógica de sucursales debemos moverla del gateway, el gateway solo debe encargarse de redireccionar y nada mas.

como requisito necesitamos tener validaciones, tambien debemos manejar correctamente las excepciones retornando un 500 o 400 segun sea el caso, debemos manejar correctamente las respuestas de manera standard con data con el objecto o array de respuesta, agreguemos paginación para un mejor orden visual en el frontend, code para el 200 o 201.

Debemos apuntar a una respuesta de este tipo, debemos normalizarlo en todo el proyecto

```JSON
{
  "code": 200,
  "data": {}, // []
  "message": "string",
  "pagination": {
    "count": 10,
    "pages": 1
  }
}
```
