import { Router } from "express";
import { getClients } from "../controllers/clients.controller.js";
import { getProviders } from "../controllers/provider.controller.js";
import { getEmployees } from "../controllers/employee.controller.js";

const apiRouter = Router();

apiRouter.get("/clientes", getClients);
apiRouter.get("/proveedores", getProviders);
apiRouter.get("/empleados", getEmployees);

export { apiRouter };
