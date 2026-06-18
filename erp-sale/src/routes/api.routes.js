import { Router } from "express";
import {
  getSales, createSale, getSale, updateSaleStatus,
  getInvoicePdf, getRevenue, getRevenuePdf, getCustomerFidelity, getTopCustomersList,
} from "../controllers/sale.controller.js";
import {
  createSaleValidator, updateStatusValidator, idParamValidator, dateRangeValidator,
} from "../validators/index.js";
import { validationResultMiddleware } from "../util/response.js";

const apiRouter = Router();

apiRouter.get("/ventas", getSales);

apiRouter.post("/ventas", createSaleValidator, validationResultMiddleware, createSale);

apiRouter.get("/ventas/:id", idParamValidator, validationResultMiddleware, getSale);

apiRouter.put("/ventas/:id", idParamValidator, updateStatusValidator, validationResultMiddleware, updateSaleStatus);

apiRouter.get("/ventas/facturas/:id/pdf", idParamValidator, validationResultMiddleware, getInvoicePdf);

apiRouter.get("/ventas/reportes/ingresos", dateRangeValidator, validationResultMiddleware, getRevenue);
apiRouter.get("/ventas/reportes/ingresos/pdf", dateRangeValidator, validationResultMiddleware, getRevenuePdf);

apiRouter.get("/ventas/clientes/top", getTopCustomersList);

apiRouter.get("/ventas/clientes/:id/fidelizacion", idParamValidator, validationResultMiddleware, getCustomerFidelity);

export { apiRouter };
