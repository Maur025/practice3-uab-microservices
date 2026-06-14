import { Router } from "express";
import { getSales, createSale, getSale, updateSaleStatus } from "../controllers/sale.controller.js";

const apiRouter = Router();

// Rutas para Ventas
apiRouter.get("/ventas", getSales);               // Ver todas las ventas (Para la tabla principal)
apiRouter.post("/ventas", createSale);            // Crear venta nueva
apiRouter.get("/ventas/:id", getSale);            // Ver detalle de una venta (Para el botón del "Ojo")
apiRouter.put("/ventas/:id", updateSaleStatus);   // Actualizar venta a ANULADA (Para el botón de "Lápiz/Anular")

export { apiRouter };