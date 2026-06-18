import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeBody } from "../middlewares/sanitize.middleware.js";
import { idParamValidator, empresaValidator, empresaUpdateValidator, sucursalValidator, sucursalUpdateValidator } from "../validators/index.js";
import {
  getEmpresas,
  getEmpresa,
  postEmpresa,
  putEmpresa,
  removeEmpresa,
  getSucursales,
  getSucursal,
  postSucursal,
  putSucursal,
  removeSucursal,
} from "../controllers/company.controller.js";

const apiRouter = Router();

apiRouter.get("/empresas", getEmpresas);
apiRouter.get("/empresas/:id", idParamValidator, validate, getEmpresa);
apiRouter.post("/empresas", sanitizeBody, empresaValidator, validate, postEmpresa);
apiRouter.put("/empresas/:id", idParamValidator, sanitizeBody, empresaUpdateValidator, validate, putEmpresa);
apiRouter.delete("/empresas/:id", idParamValidator, validate, removeEmpresa);

apiRouter.get("/sucursales", getSucursales);
apiRouter.get("/sucursales/:id", idParamValidator, validate, getSucursal);
apiRouter.post("/sucursales", sanitizeBody, sucursalValidator, validate, postSucursal);
apiRouter.put("/sucursales/:id", idParamValidator, sanitizeBody, sucursalUpdateValidator, validate, putSucursal);
apiRouter.delete("/sucursales/:id", idParamValidator, validate, removeSucursal);

export { apiRouter };
