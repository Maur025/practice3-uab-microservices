import { Router } from "express";
import { getCollections } from "../controllers/collection.controller.js";
import { getPayments } from "../controllers/payment.controller.js";
import { getPendingCollections } from "../controllers/pending-collection.controller.js";
import { getPendingPayments } from "../controllers/pending-payment.controller.js";

const apiRouter = Router();

apiRouter.get("/incoming/pending", getPendingCollections);
apiRouter.get("/outgoing/pending", getPendingPayments);
apiRouter.get("/outgoing", getPayments);
apiRouter.get("/incoming", getCollections);

export { apiRouter };
