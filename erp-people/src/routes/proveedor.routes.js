import { Router } from "express";
import {
  createProvider,
  deleteProvider,
  getProviderById,
  getProviders,
  updateProvider,
} from "../controllers/provider.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  idParamValidator,
  proveedorUpdateValidator,
  proveedorValidator,
} from "../validators/index.js";

const providerRouter = Router();

providerRouter.get("/", getProviders);
providerRouter.get("/:id", idParamValidator, validate, getProviderById);
providerRouter.post("/", proveedorValidator, validate, createProvider);
providerRouter.put(
  "/:id",
  idParamValidator,
  proveedorUpdateValidator,
  validate,
  updateProvider,
);
providerRouter.delete("/:id", idParamValidator, validate, deleteProvider);

export { providerRouter };
