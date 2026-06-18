import { body, param } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const createPendingCollectionValidator = [
  body("id_venta").isInt({ min: 1 }).withMessage("id_venta inválido"),
  body("id_cliente").isInt({ min: 1 }).withMessage("id_cliente inválido"),
  body("monto_total").isFloat({ min: 0.01 }).withMessage("monto_total debe ser positivo"),
];

export const createCollectionValidator = [
  body("id_cxc").isInt({ min: 1 }).withMessage("id_cxc inválido"),
  body("monto").isFloat({ min: 0.01 }).withMessage("monto debe ser positivo"),
  body("metodo_pago").optional().isString().withMessage("metodo_pago debe ser texto"),
  body("observacion").optional().isString().withMessage("observacion debe ser texto"),
];

export const createPendingPaymentValidator = [
  body("id_compra").isInt({ min: 1 }).withMessage("id_compra inválido"),
  body("id_proveedor").isInt({ min: 1 }).withMessage("id_proveedor inválido"),
  body("monto_total").isFloat({ min: 0.01 }).withMessage("monto_total debe ser positivo"),
];

export const createSupplierPaymentValidator = [
  body("id_cxp").isInt({ min: 1 }).withMessage("id_cxp inválido"),
  body("monto").isFloat({ min: 0.01 }).withMessage("monto debe ser positivo"),
  body("metodo_pago").optional().isString().withMessage("metodo_pago debe ser texto"),
  body("observacion").optional().isString().withMessage("observacion debe ser texto"),
];
