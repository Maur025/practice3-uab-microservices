# ERP Sale

## Descripcion

Modulo orientado al ciclo de ventas del sistema. Su configuracion esta pensada para exponer una API propia y trabajar con MariaDB.

Encargado de las tablas:

- Venta
- Detalle venta
- Factura
- Detalle factura

## Puerto

7804 por defecto. Puede cambiarse con la variable de entorno `SERVER_APP_PORT`.

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
GET /api/ventas/ventas
```

## Variables de entorno

| Archivo        | Descripcion                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| `.env.example` | Plantilla con el puerto del servicio de ventas y los datos basicos para acceder a MariaDB. |

## Nota

Este modulo esta pensado para manejar ventas, facturacion y el registro de operaciones comerciales.

TRABAJO REALIZADO POR DEV 3: 

# Microservicio de Ventas (`erp-sale`)

Este microservicio gestiona el ciclo de vida completo de las ventas, la facturación y la comunicación inicial con los módulos de inventario y finanzas utilizando un patrón de coreografía para microservicios.

## 🚀 Arquitectura y Decisiones Técnicas

* **Transacciones Locales Seguras:** Se utilizan transacciones SQL (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`) para asegurar que la cabecera de la venta, el detalle del carrito y la factura nazcan al mismo tiempo.
* **Cálculo de Impuestos (IVA):** El sistema calcula automáticamente el 13% de IVA sobre el total de la venta, separando la Base Imponible del Impuesto en la tabla `factura` para su correcta representación fiscal.
* **Prevención de Deadlocks:** Para evitar bloqueos de base de datos (`Lock wait timeout exceeded`), la transacción local hace un `commit` ANTES de realizar llamadas HTTP a otros microservicios.
* **Transacciones Distribuidas (Compensación):** Al realizar una venta a `CREDITO`, el sistema se comunica sincrónicamente con `erp-payment`. Si el microservicio de finanzas rechaza la operación o está caído, `erp-sale` ejecuta una lógica de compensación automática actualizando el estado de la Venta y la Factura a `ANULADA`.

## 📡 API Endpoints (Base: `/api/sales`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Retorna la lista de todas las ventas registradas. |
| `POST` | `/` | Registra una nueva venta, genera la factura y se comunica con Finanzas/Inventario. |
| `GET` | `/:id` | Retorna la cabecera de una venta ESPECÍFICA junto con el arreglo de su `detalle_ventas`. |
| `PUT` | `/:id` | Recibe `{ "estado": "ANULADA" }`. Anula lógicamente la venta y su factura asociada. |

## 🔗 Integraciones Externas

* **Finanzas (`erp-payment`):** POST a `http://localhost:7805/api/payments/incoming/pending`.
* **Inventario (`erp-inventory`):** POST a `http://localhost:7803/api/stock/descontar` *(Código preparado y comentado, listo para activación).*
