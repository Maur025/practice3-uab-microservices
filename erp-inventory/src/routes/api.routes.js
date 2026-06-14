import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";

const apiRouter = Router();

apiRouter.get("/catalogo/productos", getProducts);

export { apiRouter };
