import { Router } from "express";
import { getPurchases } from "../controllers/purchase.controller.js";

const apiRouter = Router();

apiRouter.get("", getPurchases);

export { apiRouter };
