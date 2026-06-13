import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";

const apiRouter = Router();

apiRouter.get("/inventories/products", getProducts);

export { apiRouter };
