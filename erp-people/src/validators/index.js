import { body, param } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const loginValidator = [
  body("identifier")
    .notEmpty()
    .withMessage("Identificador requerido (nombre_usuario o correo)"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
];

export const refreshValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token requerido"),
];

export const sucursalValidator = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
];

export const sucursalUpdateValidator = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("Nombre no puede estar vacío"),
  body("activo").optional().isBoolean().withMessage("activo debe ser booleano"),
];

export const cargoValidator = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
];

export const cargoUpdateValidator = [
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("Nombre no puede estar vacío"),
];

export const clienteValidator = [
  body("nombres").notEmpty().withMessage("Nombres requeridos"),
  body("apellidos")
    .optional()
    .isString()
    .withMessage("apellidos debe ser texto"),
  body("nit_ci").optional().isString().withMessage("nit_ci debe ser texto"),
  body("telefono").optional().isString().withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];

export const clienteUpdateValidator = [
  body("nombres")
    .optional()
    .notEmpty()
    .withMessage("Nombres no puede estar vacío"),
  body("apellidos")
    .optional()
    .isString()
    .withMessage("apellidos debe ser texto"),
  body("nit_ci").optional().isString().withMessage("nit_ci debe ser texto"),
  body("telefono").optional().isString().withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];

export const proveedorValidator = [
  body("razon_social").notEmpty().withMessage("razon_social requerido"),
  body("nit").optional().isString().withMessage("nit debe ser texto"),
  body("telefono").optional().isString().withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];

export const proveedorUpdateValidator = [
  body("razon_social")
    .optional()
    .notEmpty()
    .withMessage("razon_social no puede estar vacío"),
  body("nit").optional().isString().withMessage("nit debe ser texto"),
  body("telefono").optional().isString().withMessage("telefono debe ser texto"),
  body("email").optional().isEmail().withMessage("email inválido"),
  body("direccion")
    .optional()
    .isString()
    .withMessage("direccion debe ser texto"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];

export const empleadoValidator = [
  body("sucursal_id").isInt({ min: 1 }).withMessage("sucursal_id inválido"),
  body("cargo_id").isInt({ min: 1 }).withMessage("cargo_id inválido"),
  body("nombres").notEmpty().withMessage("Nombres requeridos"),
  body("apellido_paterno").notEmpty().withMessage("Apellido paterno requerido"),
  body("numero_documento")
    .notEmpty()
    .withMessage("Número de documento requerido"),
  body("fecha_ingreso").isISO8601().withMessage("Fecha de ingreso inválida"),
];

export const empleadoUpdateValidator = [
  body("sucursal_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("sucursal_id inválido"),
  body("cargo_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("cargo_id inválido"),
  body("fecha_ingreso")
    .optional()
    .isISO8601()
    .withMessage("Fecha de ingreso inválida"),
  body("activo").optional().isBoolean().withMessage("activo debe ser booleano"),
];

export const usuarioValidator = [
  body("empleado_id").isInt({ min: 1 }).withMessage("empleado_id inválido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Contraseña mínimo 8 caracteres"),
  body("rol").optional().notEmpty().withMessage("rol no puede estar vacío"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
  body().custom((_, { req }) => {
    const username = req.body.username ?? req.body.nombre_usuario;
    if (!username || `${username}`.trim().length === 0) {
      throw new Error("username es requerido");
    }

    return true;
  }),
];

export const usuarioUpdateValidator = [
  body("empleado_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("empleado_id inválido"),
  body("username")
    .optional()
    .notEmpty()
    .withMessage("username no puede estar vacío"),
  body("nombre_usuario")
    .optional()
    .notEmpty()
    .withMessage("nombre_usuario no puede estar vacío"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Contraseña mínimo 8 caracteres"),
  body("rol").optional().notEmpty().withMessage("rol no puede estar vacío"),
  body("estado").optional().isBoolean().withMessage("estado debe ser booleano"),
];
