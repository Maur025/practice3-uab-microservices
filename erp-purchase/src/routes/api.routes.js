import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  idParamValidator,
  createPurchaseValidator,
  updatePurchaseStatusValidator,
  dateRangeQueryValidator,
} from "../validators/index.js";
import {
  getPurchases,
  getPurchase,
  postPurchase,
  putPurchaseStatus,
} from "../controllers/purchase.controller.js";

const apiRouter = Router();

apiRouter.get("/compras", dateRangeQueryValidator, validate, getPurchases);
apiRouter.get("/compras/:id", idParamValidator, validate, getPurchase);
apiRouter.post("/compras", createPurchaseValidator, validate, postPurchase);
apiRouter.put("/compras/:id", idParamValidator, updatePurchaseStatusValidator, validate, putPurchaseStatus);

export { apiRouter };
