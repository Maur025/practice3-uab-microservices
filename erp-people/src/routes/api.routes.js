import { Router } from "express";
import { getClients } from "../controllers/clients.controller.js";
import { getProviders } from "../controllers/provider.controller.js";
import { getEmployees } from "../controllers/employee.controller.js";

const apiRouter = Router();

apiRouter.get("/clients", getClients);
apiRouter.get("/providers", getProviders);
apiRouter.get("/employees", getEmployees);

export { apiRouter };
