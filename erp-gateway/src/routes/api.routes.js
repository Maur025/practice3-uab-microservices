import { Router } from "express";
import { getBranches } from "../controllers/branch.controller.js";

const apiRouter = Router();

apiRouter.get("/sucursales", getBranches);

export { apiRouter };
