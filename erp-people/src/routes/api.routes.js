import { Router } from "express";
import { getClients } from "../controllers/clients.controller.js";
import { getProviders } from "../controllers/provider.controller.js";
import { getEmployees } from "../controllers/employee.controller.js";

const apiRouter = Router();

apiRouter.get("/people/clients", getClients);
apiRouter.get("/people/providers", getProviders);
apiRouter.get("/people/employees", getEmployees);

export { apiRouter };
