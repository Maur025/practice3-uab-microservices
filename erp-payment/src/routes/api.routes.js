import { Router } from "express";
import { getCollections } from "../controllers/collection.controller.js";
import { getPayments } from "../controllers/payment.controller.js";
import { getPendingCollections } from "../controllers/pending-collection.controller.js";
import { getPendingPayments } from "../controllers/pending-payment.controller.js";

const apiRouter = Router();

apiRouter.get("/cuentas-por-cobrar", getPendingCollections);
apiRouter.get("/cuentas-por-pagar", getPendingPayments);
apiRouter.get("/pagos-proveedores", getPayments);
apiRouter.get("/pagos-clientes", getCollections);

export { apiRouter };
