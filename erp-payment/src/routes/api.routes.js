import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  idParamValidator,
  createPendingCollectionValidator,
  createCollectionValidator,
  createPendingPaymentValidator,
  createSupplierPaymentValidator,
} from "../validators/index.js";
import { getCollections, createCollection } from "../controllers/collection.controller.js";
import { getPayments, createSupplierPayment } from "../controllers/payment.controller.js";
import { getPendingCollections, getPendingCollection, createPendingCollection } from "../controllers/pending-collection.controller.js";
import { getPendingPayments, getPendingPayment, createPendingPayment } from "../controllers/pending-payment.controller.js";

const apiRouter = Router();

apiRouter.get("/cuentas-por-cobrar", getPendingCollections);
apiRouter.get("/cuentas-por-cobrar/:id", idParamValidator, validate, getPendingCollection);
apiRouter.post("/cuentas-por-cobrar", createPendingCollectionValidator, validate, createPendingCollection);

apiRouter.get("/pagos-clientes", getCollections);
apiRouter.post("/pagos-clientes", createCollectionValidator, validate, createCollection);

apiRouter.get("/cuentas-por-pagar", getPendingPayments);
apiRouter.get("/cuentas-por-pagar/:id", idParamValidator, validate, getPendingPayment);
apiRouter.post("/cuentas-por-pagar", createPendingPaymentValidator, validate, createPendingPayment);

apiRouter.get("/pagos-proveedores", getPayments);
apiRouter.post("/pagos-proveedores", createSupplierPaymentValidator, validate, createSupplierPayment);

export { apiRouter };
