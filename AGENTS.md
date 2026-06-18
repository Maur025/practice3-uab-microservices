# ERP Supermercado — Microservicios (Backend)

## Checklist de Requisitos

### Backend (Microservicios)

- [x] **1. Módulo Empresa (erp-company)** — CRUD completo de empresas y sucursales con validaciones, paginación, Swagger, y respuesta estandarizada.
- [x] **2. Módulo Inventarios (erp-inventory)** — CRUD completo de categorías, unidades de medida, productos (con campo costo), gestión de stock por sucursal, movimientos de inventario, inicialización de stocks, transferencia entre sucursales, reporte de stock por empresa. Validaciones con express-validator, paginación, Swagger.
- [x] **3. Módulo Personas (erp-people)** — CRUD completo de clientes, proveedores, cargos, empleados y usuarios con validaciones y paginación.
- [x] **4. Módulo Ventas (erp-sale)** — Creación de venta con transacción, descuento de stock integrado, generación de PDF de factura (vía pdfkit), estadísticas de fidelización de clientes, reporte de ingresos, validaciones con express-validator, Swagger completo. Lint pasa limpio.
- [x] **5. Módulo Compras (erp-purchase)** — CRUD completo con transacciones, integración con inventario (entrada de stock + movimiento_inventario), integración con pagos (CxP vía HTTP). Express-validator, Swagger.
- [x] **6. Módulo Pagos (erp-payment)** — CxC y pagos de clientes con FOR UPDATE. CxP completo: creación y pago a proveedores con FOR UPDATE. Express-validator, Swagger.
- [x] **7. API Gateway (erp-gateway)** — Proxy funcionando con empresa movida a erp-company (puerto 7806). Sin lógica de negocio interna.
- [x] **8. Reportes de ingresos (req. 10)** — Endpoint GET `/ventas/reportes/ingresos` con filtros por fecha, rango y sucursal. Integrado en erp-sale.
- [x] **9. Respuesta estandarizada** — Patrón `{ code, data, message, pagination }` implementado en todos los servicios.
- [x] **10. Validaciones con express-validator** — Implementadas en los 6 microservicios (erp-company, erp-people, erp-inventory, erp-sale, erp-purchase, erp-payment).
- [x] **11. PDF de factura (req. 7)** — GET `/ventas/facturas/:id/pdf` retorna PDF con datos de factura + detalle_factura, content-type: pdf.
- [x] **12. Inicialización de stocks (req. 4)** — Implementado en POST `/stock/inicializar`.
- [x] **13. Transferencia de stocks (req. 5)** — Implementado en POST `/stock/transferir`.
- [x] **14. Estadísticas de fidelización (req. 8)** — Endpoints: GET `/ventas/clientes/:id/fidelizacion` (frecuencia, sucursal preferida, producto más consumido) y GET `/ventas/clientes/top` (top compradores).
- [x] **15. Base de datos** — Schema SQL completo con todas las tablas necesarias (empresa, sucursal, producto, inventario, movimiento_inventario, venta, factura, etc.).
- [x] **16. Reporte PDF de stock por empresa** — GET `/inventarios/stock/reporte/pdf` genera PDF con stock agrupado por empresa/sucursal.
- [x] **17. Reporte PDF de ingresos** — GET `/ventas/reportes/ingresos/pdf` genera PDF con resumen de ingresos y desglose por sucursal.
- [x] **18. Fix erp-sale column names** — Corregido `inventario.stock` → `stock_actual` y `movimiento_inventario` columnas para coincidir con schema SQL.

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
- **`erp-purchase/src/services/purchase.service.js`**: `createPurchase` — crea compra + detalle_compra + entrada de stock + movimiento_inventario + (opcional) llama a payment para CxP
- **`erp-payment/src/services/payment.service.js`**: `registerSupplierPayment` — pago a proveedor con `SELECT ... FOR UPDATE`, valida saldo, actualiza CxP

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

---

## 📋 Guía de Integración para Frontend (Angular)

Actualmente el frontend usa `useMockData: true` con `MockDatabase`. Para conectar con los microservicios reales se debe cambiar a `useMockData: false` y apuntar al **API Gateway** (`http://localhost:7800`). Todas las rutas pasan por el gateway y este redirige al microservicio correspondiente.

### 1. Configuración base

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:7800/api", // Gateway
  useMockData: false,
};
```

### 2. Respuesta estandarizada — TODOS los endpoints

```typescript
interface ApiResponse<T> {
  code: number; // 200 | 201 | 400 | 404 | 500
  data: T; // objeto | array | null
  message: string;
  pagination?: {
    count: number;
    pages: number;
  };
}
```

**Paginación:** toda GET-list acepta `?page=1&limit=20` y devuelve `pagination`. Default: page=1, limit=20, max limit=100.

---

### 3. Catálogo base (datos para selects/dropdowns)

Estos endpoints devuelven datos maestros que se cargan al iniciar para poblar selects:

```typescript
// ─── Empresas ───────────────────────────────────────
GET  /organizaciones/empresas           // [{ id_empresa, nombre, nit }]
POST /organizaciones/empresas           // body: { nombre, nit, direccion?, telefono?, email? }
PUT  /organizaciones/empresas/:id       // body: { nombre?, nit?, direccion?, telefono?, email?, estado? }
DEL  /organizaciones/empresas/:id       // soft-delete

// ─── Sucursales ────────────────────────────────────
GET  /organizaciones/sucursales?        // ?id_empresa=<int> para filtrar
     id_empresa=<int>
POST /organizaciones/sucursales         // body: { id_empresa, nombre, direccion?, ciudad? }
PUT  /organizaciones/sucursales/:id     // body parcial
DEL  /organizaciones/sucursales/:id     // soft-delete

// ─── Categorías ─────────────────────────────────────
GET  /inventarios/catalogo/categorias
POST /inventarios/catalogo/categorias   // body: { nombre }
PUT  /inventarios/catalogo/categorias/:id
DEL  /inventarios/catalogo/categorias/:id

// ─── Unidades de Medida ────────────────────────────
GET  /inventarios/catalogo/unidades
POST /inventarios/catalogo/unidades     // body: { nombre, abreviatura }
PUT  /inventarios/catalogo/unidades/:id
DEL  /inventarios/catalogo/unidades/:id

// ─── Productos ──────────────────────────────────────
GET  /inventarios/catalogo/productos?   // ?id_categoria=<int>&id_sucursal=<int>
     id_categoria=<int>&
     id_sucursal=<int>
POST /inventarios/catalogo/productos    // body: { id_categoria, id_unidad, nombre,
                                        //         precio_venta, codigo?, descripcion?, costo? }
PUT  /inventarios/catalogo/productos/:id
DEL  /inventarios/catalogo/productos/:id  // soft-delete

// ─── Clientes ────────────────────────────────────────
GET  /personas/clientes
POST /personas/clientes                 // body: { nombres, apellidos?, nit_ci?, telefono?,
                                        //         email?, direccion? }
PUT  /personas/clientes/:id
DEL  /personas/clientes/:id

// ─── Proveedores ─────────────────────────────────────
GET  /personas/proveedores
POST /personas/proveedores              // body: { razon_social, nit?, telefono?,
                                        //         email?, direccion? }
PUT  /personas/proveedores/:id
DEL  /personas/proveedores/:id

// ─── Usuarios ────────────────────────────────────────
GET  /personas/usuarios
POST /personas/usuarios                 // body: { empleado_id, password, username,
                                        //         rol? }
PUT  /personas/usuarios/:id

// ─── Cargos ──────────────────────────────────────────
GET  /personas/cargos
POST /personas/cargos                   // body: { nombre }
PUT  /personas/cargos/:id
```

---

### 4. Inventario — Stock y movimientos

#### 4.1 Ver stock por sucursal

```
GET /inventarios/stock?id_sucursal=<int>&id_producto=<int>
```

Devuelve inventario con joins a sucursal, producto, unidad. Incluye `stock_actual`, `stock_minimo`.

#### 4.2 Inicializar stock (carga inicial)

```
POST /inventarios/stock/inicializar
Content-Type: application/json

{
  "id_sucursal": 1,
  "productos": [
    { "id_producto": 1, "cantidad": 100, "stock_minimo": 10, "costo_unitario": 8.50, "precio_venta": 15.00 }
  ]
}
```

**Respuesta:** `{ movimientos_generados: [id_mov, ...] }` (código 201)

**Campos nuevos en productos[]:**
- `costo_unitario` (opcional): Costo unitario del lote inicial (actualiza `producto.costo` como promedio ponderado)
- `precio_venta` (opcional): Precio de venta del lote (actualiza `producto.precio_venta` global)

#### 4.3 Transferir stock entre sucursales

```
POST /inventarios/stock/transferir
Content-Type: application/json

{
  "id_sucursal_origen": 1,
  "id_sucursal_destino": 2,
  "productos": [
    { "id_producto": 1, "cantidad": 50 }
  ]
}
```

**Respuesta:** `{ movimientos_generados: [id_mov, ...] }` (código 200)

#### 4.4 Movimientos manuales

```
POST /inventarios/movimientos
Content-Type: application/json

{
  "id_sucursal": 1,
  "id_producto": 1,
  "tipo_movimiento": "ENTRADA",    // ENTRADA | SALIDA | AJUSTE
  "origen": "AJUSTE",              // COMPRA | VENTA | DEVOLUCION | AJUSTE
  "cantidad": 10,
  "referencia": "AJUSTE-MANUAL",
  "observacion": "Ajuste por inventario físico",
  "costo_unitario": 8.50,       // opcional, solo para ENTRADA
  "precio_venta": 15.00         // opcional, solo para ENTRADA
}
```

---

### 5. Ventas — Flujo principal

#### 5.1 Registrar venta (core transaccional)

```
POST /ventas/ventas
Content-Type: application/json

{
  "id_sucursal": 1,
  "id_usuario": 1,
  "tipo_pago": "CONTADO",           // CONTADO | CREDITO
  "id_cliente": null,               // null = consumidor final
  "descuento": 0,
  "nit_cliente": "1234567",
  "razon_social_cliente": "Juan Pérez",
  "carrito": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_unitario": 18.50,
      "descripcion": "Producto X"
    }
  ]
}
```

**Respuesta:**

```json
{
  "code": 201,
  "data": {
    "id_venta": 1,
    "numero_factura": "F-1718612345678"
  },
  "message": "Venta y factura registradas correctamente"
}
```

**Lo que hace internamente:**

1. Crea `venta` + `detalle_venta`
2. Bloquea fila `inventario` con `FOR UPDATE`, descuenta stock
3. Registra `movimiento_inventario` tipo `SALIDA`
4. Genera `factura` + `detalle_factura` (snapshot de precios)
5. Si `tipo_pago = CREDITO`: llama a erp-payment para crear CxC; si falla, anula la venta

#### 5.2 Consultar venta

```
GET /ventas/ventas/:id
```

Devuelve: venta + `detalle_ventas[]` + `detalle_factura[]` + datos sucursal/usuario/factura

#### 5.3 Anular venta

```
PUT /ventas/ventas/:id
Content-Type: application/json

{ "estado": "ANULADA" }
```

**Respuesta:** `{ code: 200, data: { id_venta, estado: "ANULADA" }, message: "..." }`

#### 5.4 Obtener PDF de factura

```
GET /ventas/ventas/facturas/:id/pdf
```

**Respuesta:** `application/pdf` binario (NO base64). El frontend debe abrirlo con:

```typescript
// Angular: descargar y mostrar PDF
this.http
  .get(`ventas/ventas/facturas/${id}/pdf`, { responseType: "blob" })
  .subscribe((blob) => {
    const url = window.URL.createObjectURL(blob);
    window.open(url); // nueva pestaña
    // o <iframe [src]="sanitizer.bypassSecurityTrustResourceUrl(url)">
  });
```

---

### 6. Compras — Flujo de reposición

#### 6.1 Registrar compra

```
POST /compras/compras
Content-Type: application/json

{
  "id_proveedor": 1,
  "id_sucursal": 1,
  "id_usuario": 1,
  "tipo_pago": "CONTADO",           // CONTADO | CREDITO
  "detalles": [
    {
      "id_producto": 1,
      "cantidad": 50,
      "precio_compra": 12.00
    }
  ]
}
```

**Respuesta:** objeto compra completo con `detalles[]` y `cuenta_por_pagar` (201)

**Lo que hace internamente:**

1. Crea `compra` + `detalle_compra`
2. Actualiza/crea `inventario` (ENTRADA)
3. Registra `movimiento_inventario` tipo `ENTRADA`
4. Si `CREDITO`: llama a erp-payment para crear CxP; si falla, anula la compra

#### 6.2 Consultar compra

```
GET /compras/compras/:id
```

#### 6.3 Anular compra

```
PUT /compras/compras/:id
Content-Type: application/json

{ "estado": "ANULADA" }
```

**Respuesta:** `{ code: 200, data: { id_compra, estado: "ANULADA" }, message: "..." }`

---

### 7. Pagos — CxC y CxP

#### 7.1 Cuentas por Cobrar (CxC)

```
GET  /finanzas/cuentas-por-cobrar          // lista con paginación
GET  /finanzas/cuentas-por-cobrar/:id      // detalle + pagos[]
POST /finanzas/cuentas-por-cobrar          // solo uso interno (lo llama erp-sale)
```

#### 7.2 Registrar pago de cliente (Cobro)

```
POST /finanzas/pagos-clientes
Content-Type: application/json

{
  "id_cxc": 1,
  "monto": 50.00,
  "metodo_pago": "EFECTIVO",        // opcional
  "observacion": "Pago parcial"     // opcional
}
```

**Respuesta:**

```json
{
  "code": 201,
  "data": {
    "id_pago_cliente": 1,
    "nuevo_saldo": 25.0,
    "estado_cuenta": "PENDIENTE" // PENDIENTE | PAGADA
  },
  "message": "Pago registrado exitosamente"
}
```

#### 7.3 Cuentas por Pagar (CxP)

```
GET  /finanzas/cuentas-por-pagar           // lista con paginación
GET  /finanzas/cuentas-por-pagar/:id       // detalle + pagos[]
POST /finanzas/cuentas-por-pagar           // solo uso interno (lo llama erp-purchase)
```

#### 7.4 Registrar pago a proveedor

```
POST /finanzas/pagos-proveedores
Content-Type: application/json

{
  "id_cxp": 1,
  "monto": 500.00,
  "metodo_pago": "TRANSFERENCIA",
  "observacion": "Pago factura #123"
}
```

**Respuesta:** mismo formato que pagos-clientes pero con `id_pago_proveedor`.

---

### 8. Reportes

#### 8.1 Reporte de stock por empresa

```
GET /inventarios/stock/reporte?id_empresa=<int>&id_producto=<int>
```

**Respuesta JSON:** Array de filas con empresa, sucursal, producto, `stock_actual`.

```
GET /inventarios/stock/reporte/pdf?id_empresa=<int>&id_producto=<int>
```

**Respuesta:** `application/pdf` binario con tabla agrupada por empresa.

#### 8.2 Reporte de ingresos

```
GET /ventas/ventas/reportes/ingresos?fecha=2026-06-17
GET /ventas/ventas/reportes/ingresos?fecha_desde=2026-06-01&fecha_hasta=2026-06-17
GET /ventas/ventas/reportes/ingresos?fecha=2026-06-17&id_sucursal=1
```

**Respuesta JSON:**

```json
{
  "code": 200,
  "data": {
    "total_ventas": 42,
    "total_ingresos": 12500.50,
    "total_descuentos": 150.00,
    "ventas_contado": 30,
    "ventas_credito": 12,
    "sucursales": {
      "1": { "nombre": "Prado", "total": 8000, "cantidad": 20 },
      "2": { "nombre": "El Alto", "total": 4500.50, "cantidad": 22 }
    },
    "ventas": [ ... ]              // filas individuales
  },
  "message": "Reporte de ingresos generado"
}
```

```
GET /ventas/ventas/reportes/ingresos/pdf?fecha=2026-06-17
```

**Respuesta:** `application/pdf` binario.

#### 8.3 Fidelización de clientes

```
GET /ventas/ventas/clientes/top?limit=10&id_sucursal=1
```

Top compradores: `[{ id_cliente, nombres, nit_ci, total_compras, total_gastado, ultima_compra }]`

```
GET /ventas/ventas/clientes/:id/fidelizacion?id_sucursal=1
```

Estadísticas: frecuencia, sucursal preferida, producto más consumido, últimas compras.

---

### 9. Mapa de migración (Mock → API real)

| Componente Angular    | Reemplazar MockDatabase por        | Endpoint real                                                          |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| Catálogo (selects)    | `getAll()` de entidad              | `GET /{apiPrefix}/{entity}` con paginación                             |
| EntityCrud (listar)   | `getAll()` → `getPaged()`          | `GET ?page=&limit=`                                                    |
| EntityCrud (crear)    | `create()`                         | `POST` con body JSON                                                   |
| EntityCrud (editar)   | `update()`                         | `PUT /:id` con body parcial                                            |
| EntityCrud (eliminar) | `delete()`                         | `DELETE /:id` (soft-delete)                                            |
| CompraFormComponent   | `mockDatabase.compras`             | `POST /compras/compras` (ver sección 6.1)                              |
| VentaFormComponent    | `mockDatabase.ventas`              | `POST /ventas/ventas` (ver sección 5.1)                                |
| Dashboard KPI         | `mockDatabase.getKpis()`           | `GET /ventas/reportes/ingresos` + `GET /inventarios/stock/reporte`     |
| Reporte Stock PDF     | No existe mock                     | `GET /inventarios/stock/reporte/pdf`                                   |
| Reporte Ingresos PDF  | No existe mock                     | `GET /ventas/reportes/ingresos/pdf`                                    |
| Factura PDF           | `mockDatabase.generarFacturaPdf`   | `GET /ventas/facturas/:id/pdf` (blob)                                  |
| Cliente fidelización  | `mockDatabase.obtenerFidelizacion` | `GET /ventas/clientes/:id/fidelizacion`                                |
| Pagos CxC             | No existe UI especializada         | `GET /finanzas/cuentas-por-cobrar` + `POST /finanzas/pagos-clientes`   |
| Pagos CxP             | No existe UI especializada         | `GET /finanzas/cuentas-por-pagar` + `POST /finanzas/pagos-proveedores` |

### 10. Notas importantes para el frontend

1. **PDFs:** Siempre `responseType: 'blob'`. Usar `window.URL.createObjectURL(blob)` para mostrar. NO usar base64. Content-Type: `application/pdf`, Content-Disposition: `inline`.

2. **Paginación:** Cada GET-list devuelve `pagination: { count, pages }`. El frontend debe enviar `page` y `limit` en cada petición.

3. **Soft-deletes:** Las entidades con `estado` booleano se "eliminan" con `DELETE` (set `estado=0`). Categorías, unidades e inventario usan hard-delete (registro se borra realmente).

4. **Errores 400 vs 500:** Todos los servicios retornan `{ code, data: null, message, details? }`. Los errores de validación (400) tienen `message` descriptivo. Errores 500 tienen mensaje genérico.

5. **Transacciones:** POST `/ventas/ventas` y POST `/compras/compras` son transaccionales. Si algo falla a mitad, todo se revierte (rollback). Si el pago/CxP externo falla, la operación se anula automáticamente.

6. **Pagos parciales:** Tanto `POST /pagos-clientes` como `POST /pagos-proveedores` permiten pagos parciales. Actualizan `saldo` automáticamente. Cuando el saldo llega a 0, el estado cambia a `PAGADA`.

7. **Swagger:** Cada microservicio tiene su propia UI en `http://localhost:{puerto}/{apiPrefix}/docs` (ej: `http://localhost:7800/api/organizaciones/docs`). También se accede vía gateway.

### 11. Sistema de Lotes (Nuevo)

Se agregó el sistema de **lotes** (`producto_lote`) para manejar stock con trazabilidad de costos por sucursal. El stock `inventario.stock_actual` ahora se calcula como la **suma de todos los lotes activos** de un producto en una sucursal.

#### 11.1 Tabla `producto_lote`

| Columna          | Tipo           | Descripción                                    |
| ---------------- | -------------- | ---------------------------------------------- |
| `id_lote`        | PK auto        | ID del lote                                    |
| `id_producto`    | FK → producto  | Producto                                       |
| `id_sucursal`    | FK → sucursal  | Sucursal                                       |
| `cantidad`       | DECIMAL(10,2)  | Cantidad disponible en este lote               |
| `costo_unitario` | DECIMAL(10,2)  | Costo unitario de este lote                    |
| `precio_venta`   | DECIMAL(10,2)  | Precio de venta de este lote                   |
| `origen`         | VARCHAR(50)    | INICIAL \| COMPRA \| TRANSFERENCIA \| AJUSTE \| DEVOLUCION |
| `referencia`     | VARCHAR(100)   | Referencia (ej: COMPRA-5, VENTA-3)            |
| `fecha_ingreso`  | DATETIME       | Fecha de ingreso del lote                     |

#### 11.2 Endpoints de Lotes

```
GET /inventarios/lotes?id_sucursal=<int>&id_producto=<int>
```
Lista todos los lotes activos (cantidad > 0) ordenados FIFO (más antiguos primero). Incluye `costo_unitario`, `precio_venta`, `origen`.

```
GET /inventarios/lotes/:id
```
Detalle de un lote específico.

```
POST /inventarios/lotes
Content-Type: application/json

{
  "id_producto": 1,
  "id_sucursal": 1,
  "cantidad": 50,
  "costo_unitario": 12.50,     // opcional
  "precio_venta": 18.00,       // opcional
  "referencia": "AJUSTE-MANUAL"
}
```
Crea un lote manualmente. Si se provee `precio_venta`, actualiza `producto.precio_venta` global. Si se provee `costo_unitario`, recalcula `producto.costo` como promedio ponderado.

#### 11.3 Inicialización de stock (actualizada)

```
POST /inventarios/stock/inicializar
Content-Type: application/json

{
  "id_sucursal": 1,
  "productos": [
    {
      "id_producto": 1,
      "cantidad": 100,
      "stock_minimo": 10,
      "costo_unitario": 8.50,     // NUEVO: opcional, costo del lote inicial
      "precio_venta": 15.00       // NUEVO: opcional, precio de venta del lote
    }
  ]
}
```

**Corrección aplicada:** Antes el stock se duplicaba (se insertaba en `inventario` y luego `ajustarStock` lo sumaba de nuevo). Ahora:
1. Se asegura la fila en `inventario` con `stock_actual=0`
2. Se crea un registro en `producto_lote` con los datos del lote
3. Se recalcula `stock_actual = SUM(producto_lote.cantidad)` 
4. Se registra el movimiento de inventario

#### 11.4 Stock ahora deriva de lotes

`inventario.stock_actual` ya no se actualiza directamente. Se recalcula desde `producto_lote` mediante:
```sql
UPDATE inventario SET stock_actual = (
  SELECT COALESCE(SUM(cantidad), 0)
  FROM producto_lote
  WHERE id_sucursal = ? AND id_producto = ?
)
```

**Flujo de descuento (FIFO):** Al vender, se descuenta de los lotes más antiguos primero.

**Flujo de ingreso:** Al comprar o inicializar, se crea un nuevo lote con su costo_unitario.

#### 11.5 Cambios en respuestas existentes

- `GET /inventarios/stock` ahora incluye: `costo_promedio` y `total_lotes`
- `GET /inventarios/catalogo/productos` actualiza `costo` y `precio_venta` automáticamente al crear lotes
- `GET /inventarios/stock/reporte` ahora incluye `costo_promedio`

### 12. Tareas pendientes para el Frontend

1. **Agregar UI de Lotes:** Crear componente para listar lotes por producto/sucursal (`GET /inventarios/lotes`). Mostrar columnas: ID, cantidad, costo_unitario, precio_venta, origen, fecha.

2. **Formulario de lote manual:** Crear formulario para agregar un lote manualmente (`POST /inventarios/lotes`) con campos: producto, sucursal, cantidad, costo_unitario (opcional), precio_venta (opcional).

3. **Inicializar stock con costo/precio:** Actualizar el formulario de inicialización de stock para incluir los campos opcionales `costo_unitario` y `precio_venta` por producto.

4. **Tabla stock con costo promedio:** Mostrar `costo_promedio` en la tabla de inventario/stock.

5. **Migración DB:** Ejecutar el script `containers/create-table/004-migrate-lotes.sql` para crear la tabla `producto_lote` y migrar datos existentes:
   ```bash
   docker exec -i market-system-db mariadb -u root -p'root123456' sistema_supermercado_db < containers/create-table/004-migrate-lotes.sql
   ```
   Esto crea un lote por cada registro existente en `inventario`, usando `producto.costo` y `producto.precio_venta`.

6. **Revisar cálculos de costos:** Verificar que después de la migración, `stock_actual` en `inventario` coincida con `SUM(cantidad)` de `producto_lote` para cada producto+sucursal.
