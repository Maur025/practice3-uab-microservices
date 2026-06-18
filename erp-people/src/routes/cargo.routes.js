import { Router } from "express";
import cargoController from "../controllers/cargo.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeBody } from "../middlewares/sanitize.middleware.js";
import {
  idParamValidator,
  cargoValidator,
  cargoUpdateValidator,
} from "../validators/index.js";

const cargoRouter = Router();

cargoRouter.get("/", cargoController.getAll);
cargoRouter.get("/:id", idParamValidator, validate, cargoController.getById);
cargoRouter.post("/", sanitizeBody, cargoValidator, validate, cargoController.create);
cargoRouter.put(
  "/:id",
  idParamValidator,
  sanitizeBody,
  cargoUpdateValidator,
  validate,
  cargoController.update,
);
cargoRouter.delete("/:id", idParamValidator, validate, cargoController.remove);

export { cargoRouter };
