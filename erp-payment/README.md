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

## Variables de entorno

| Archivo        | Descripcion                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `.env.example` | Base de configuracion con el puerto del servicio de pagos y los valores necesarios para conectarse a la base de datos. |

## Nota

Este modulo puede utilizarse para procesar cobros, registrar transacciones y coordinar integraciones con otros servicios.

TRABAJO REALIZADO POR DEV 3:
# Microservicio de Finanzas (`erp-payment`)

Este microservicio es responsable de gestionar las Cuentas por Cobrar (CxC), las Cuentas por Pagar (CxP) y registrar los ingresos/egresos fraccionados (cuotas).

## 🚀 Arquitectura y Decisiones Técnicas

* **Nacimiento de Deudas Automático:** Las cuentas por cobrar no se crean manualmente. Nacen a partir de una llamada interna desde el microservicio `erp-sale` cuando se detecta una transacción con `tipo_pago: 'CREDITO'`.
* **Bloqueos de Fila (`FOR UPDATE`):** Para la lógica de pagos y cuotas, se implementó un bloqueo pesimista a nivel de fila (`SELECT ... FOR UPDATE`) durante la transacción. Esto evita condiciones de carrera (Race Conditions) si dos cajeros intentan cobrar la misma deuda exactamente en el mismo milisegundo.
* **Cálculo Dinámico de Saldos:** Al registrar un recibo de pago, el sistema suma automáticamente el abono al `monto_cobrado`, resta el `saldo` y, si el saldo llega a cero (o menor), el estado de la cuenta por cobrar transiciona automáticamente a `PAGADA`.
* **Validaciones de Integridad:** El sistema previene sobrepagos (abonar más del saldo restante) y rechaza pagos a cuentas cuyo estado ya sea `PAGADA`.

## 📡 API Endpoints (Rutas de Ingresos / Clientes)

Base: `/api/payments`

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/incoming/pending` | Retorna la lista de cuentas por cobrar (Deudas de clientes). |
| `POST` | `/incoming/pending` | Endpoint interno. Llamado por `erp-sale` para registrar una nueva deuda con saldo inicial. |
| `GET` | `/incoming` | Retorna el historial de pagos/abonos realizados por los clientes. |
| `POST` | `/incoming` | Registra un pago/cuota de cliente, calculando el nuevo saldo de su cuenta por cobrar. |

*(Nota: Los endpoints bajo la ruta `/outgoing` están reservados para la integración con el microservicio de Compras para el pago a proveedores).*