import { Router } from "express";
import empleadoController from "../controllers/employee.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  idParamValidator,
  empleadoValidator,
  empleadoUpdateValidator,
} from "../validators/index.js";

const empleadoRouter = Router();

empleadoRouter.get("/", empleadoController.getAll);
empleadoRouter.get(
  "/:id",
  idParamValidator,
  validate,
  empleadoController.getById,
);
empleadoRouter.post(
  "/",
  empleadoValidator,
  validate,
  empleadoController.create,
);
empleadoRouter.put(
  "/:id",
  idParamValidator,
  empleadoUpdateValidator,
  validate,
  empleadoController.update,
);
empleadoRouter.delete(
  "/:id",
  idParamValidator,
  validate,
  empleadoController.remove,
);

export { empleadoRouter };
