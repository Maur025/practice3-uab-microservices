import { Router } from "express";
// Aquí agregamos createCollection para que la ruta POST funcione
import { getCollections, createCollection } from "../controllers/collection.controller.js";
import { getPayments } from "../controllers/payment.controller.js";
import { getPendingCollections, createPendingCollection } from "../controllers/pending-collection.controller.js";
import { getPendingPayments } from "../controllers/pending-payment.controller.js";

const apiRouter = Router();

// Rutas para Cuentas por Cobrar (Deudas)
apiRouter.get("/cuentas-por-cobrar", getPendingCollections);
apiRouter.post("/cuentas-por-cobrar", createPendingCollection); // <-- Tu lógica POST integrada

// Rutas para Pagos de Clientes (Cobros/Cuotas)
apiRouter.get("/pagos-clientes", getCollections);
apiRouter.post("/pagos-clientes", createCollection); // <-- Tu lógica POST integrada

// Rutas de pagos a proveedores (De otros compañeros)
apiRouter.get("/cuentas-por-pagar", getPendingPayments);
apiRouter.get("/pagos-proveedores", getPayments);

export { apiRouter };