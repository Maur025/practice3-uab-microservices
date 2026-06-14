import { Router } from "express";
// Aquí agregamos createCollection para que la ruta POST funcione
import { getCollections, createCollection } from "../controllers/collection.controller.js";
import { getPayments } from "../controllers/payment.controller.js";
import { getPendingCollections, createPendingCollection } from "../controllers/pending-collection.controller.js";
import { getPendingPayments } from "../controllers/pending-payment.controller.js";

const apiRouter = Router();

// Rutas para Cuentas por Cobrar (Deudas)
apiRouter.post("/incoming/pending", createPendingCollection);
apiRouter.get("/incoming/pending", getPendingCollections);

// Rutas para Pagos de Clientes (Cobros/Cuotas)
apiRouter.post("/incoming", createCollection); // <-- Aquí es donde usamos el nuevo import
apiRouter.get("/incoming", getCollections);

// Rutas de pagos a proveedores (De otros compañeros)
apiRouter.get("/outgoing/pending", getPendingPayments);
apiRouter.get("/outgoing", getPayments);

export { apiRouter };