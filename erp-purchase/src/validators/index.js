import { body, param, query } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const createPurchaseValidator = [
  body("id_proveedor").isInt({ min: 1 }).withMessage("Proveedor inválido"),
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("id_usuario").isInt({ min: 1 }).withMessage("Usuario inválido"),
  body("tipo_pago").isIn(["CONTADO", "CREDITO"]).withMessage("tipo_pago debe ser CONTADO o CREDITO"),
  body("detalles").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("detalles.*.id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("detalles.*.cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad debe ser mayor a 0"),
  body("detalles.*.precio_compra").isFloat({ min: 0 }).withMessage("Precio compra debe ser número positivo"),
];

export const updatePurchaseStatusValidator = [
  body("estado").equals("ANULADA").withMessage("Estado debe ser ANULADA"),
];

export const dateRangeQueryValidator = [
  query("fecha_desde").optional().isString().withMessage("fecha_desde inválida"),
  query("fecha_hasta").optional().isString().withMessage("fecha_hasta inválida"),
  query("id_proveedor").optional().isInt({ min: 1 }).withMessage("id_proveedor inválido"),
  query("id_sucursal").optional().isInt({ min: 1 }).withMessage("id_sucursal inválido"),
];
