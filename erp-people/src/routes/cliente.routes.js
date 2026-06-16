import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/clients.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  clienteUpdateValidator,
  clienteValidator,
  idParamValidator,
} from "../validators/index.js";

const clientRouter = Router();

clientRouter.get("/", getClients);
clientRouter.get("/:id", idParamValidator, validate, getClientById);
clientRouter.post("/", clienteValidator, validate, createClient);
clientRouter.put(
  "/:id",
  idParamValidator,
  clienteUpdateValidator,
  validate,
  updateClient,
);
clientRouter.delete("/:id", idParamValidator, validate, deleteClient);

export { clientRouter };
