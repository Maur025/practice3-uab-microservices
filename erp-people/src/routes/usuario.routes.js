import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeBody } from "../middlewares/sanitize.middleware.js";
import {
  idParamValidator,
  usuarioValidator,
  usuarioUpdateValidator,
} from "../validators/index.js";

const usuarioRouter = Router();

usuarioRouter.get("/", usuarioController.getAll);
usuarioRouter.get(
  "/:id",
  idParamValidator,
  validate,
  usuarioController.getById,
);
usuarioRouter.post("/", sanitizeBody, usuarioValidator, validate, usuarioController.create);
usuarioRouter.put(
  "/:id",
  idParamValidator,
  sanitizeBody,
  usuarioUpdateValidator,
  validate,
  usuarioController.update,
);
usuarioRouter.delete(
  "/:id",
  idParamValidator,
  validate,
  usuarioController.remove,
);

export { usuarioRouter };
