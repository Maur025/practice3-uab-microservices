import { Router } from "express";
import { getSales } from "../controllers/sale.controller.js";

const apiRouter = Router();

apiRouter.get("/ventas", getSales);

export { apiRouter };
