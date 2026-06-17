import { body, param } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const empresaValidator = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
  body("nit").notEmpty().withMessage("NIT requerido"),
  body("direccion").optional().isString().withMessage("direccion debe ser texto"),
  body("telefono").optional().isString().withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
];

export const empresaUpdateValidator = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("Nombre no puede estar vacío"),
  body("nit")
    .optional()
    .notEmpty()
    .withMessage("NIT no puede estar vacío"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("telefono")
    .optional()
    .isString()
    .withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];

export const sucursalValidator = [
  body("id_empresa").isInt({ min: 1 }).withMessage("id_empresa inválido"),
  body("nombre").notEmpty().withMessage("Nombre requerido"),
  body("direccion").optional().isString().withMessage("direccion debe ser texto"),
  body("ciudad").optional().isString().withMessage("ciudad debe ser texto"),
];

export const sucursalUpdateValidator = [
  body("id_empresa")
    .optional()
    .isInt({ min: 1 })
    .withMessage("id_empresa inválido"),
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("Nombre no puede estar vacío"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("ciudad")
    .optional()
    .isString()
    .withMessage("ciudad debe ser texto"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];
