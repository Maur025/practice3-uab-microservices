import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";

const apiRouter = Router();

apiRouter.get("/products", getProducts);

export { apiRouter };
