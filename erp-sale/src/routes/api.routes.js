import { Router } from "express";
import { getSales, createSale, getSale, updateSaleStatus } from "../controllers/sale.controller.js";

const apiRouter = Router();

apiRouter.get("", getSales);          // Ver todas las ventas (Para la tabla principal)
apiRouter.post("", createSale);       // Crear venta nueva
apiRouter.get("/:id", getSale);       // Ver detalle de una venta (Para el botón del "Ojo")
apiRouter.put("/:id", updateSaleStatus); // Actualizar venta a ANULADA (Para el botón de "Lápiz/Anular")

export { apiRouter };