import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
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
usuarioRouter.post("/", usuarioValidator, validate, usuarioController.create);
usuarioRouter.put(
  "/:id",
  idParamValidator,
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
