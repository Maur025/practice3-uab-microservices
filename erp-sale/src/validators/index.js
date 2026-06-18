import { body, param, query } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const createSaleValidator = [
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("id_usuario").isInt({ min: 1 }).withMessage("Usuario inválido"),
  body("tipo_pago").isIn(["CONTADO", "CREDITO"]).withMessage("Tipo de pago inválido"),
  body("carrito").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("carrito.*.id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("carrito.*.cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad inválida"),
  body("carrito.*.precio_unitario").isFloat({ min: 0 }).withMessage("Precio unitario inválido"),
  body("carrito.*.descripcion").optional().isString().withMessage("Descripción debe ser texto"),
  body("id_cliente").optional({ values: "null" }).isInt({ min: 1 }).withMessage("Cliente inválido"),
  body("descuento").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Descuento inválido"),
  body("nit_cliente").optional().isString().withMessage("NIT inválido"),
  body("razon_social_cliente").optional().isString().withMessage("Razón social inválida"),
];

export const updateStatusValidator = [
  body("estado").equals("ANULADA").withMessage("Solo se permite anular la venta"),
];

export const dateRangeValidator = [
  query("fecha").optional().isString().withMessage("Fecha inválida"),
  query("fecha_desde").optional().isString().withMessage("Fecha desde inválida"),
  query("fecha_hasta").optional().isString().withMessage("Fecha hasta inválida"),
  query("id_sucursal").optional().isInt({ min: 1 }).withMessage("Sucursal inválida"),
];
