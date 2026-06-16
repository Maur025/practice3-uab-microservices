import { body, param } from 'express-validator';

export const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
];

export const loginValidator = [
  body('identifier').notEmpty().withMessage('Identificador requerido (nombre_usuario o correo)'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
];

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
];

export const sucursalValidator = [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
];

export const sucursalUpdateValidator = [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

export const cargoValidator = [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
];

export const cargoUpdateValidator = [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

export const empleadoValidator = [
  body('sucursal_id').isInt({ min: 1 }).withMessage('sucursal_id inválido'),
  body('cargo_id').isInt({ min: 1 }).withMessage('cargo_id inválido'),
  body('nombres').notEmpty().withMessage('Nombres requeridos'),
  body('apellido_paterno').notEmpty().withMessage('Apellido paterno requerido'),
  body('numero_documento').notEmpty().withMessage('Número de documento requerido'),
  body('fecha_ingreso').isISO8601().withMessage('Fecha de ingreso inválida'),
];

export const empleadoUpdateValidator = [
  body('sucursal_id').optional().isInt({ min: 1 }).withMessage('sucursal_id inválido'),
  body('cargo_id').optional().isInt({ min: 1 }).withMessage('cargo_id inválido'),
  body('fecha_ingreso').optional().isISO8601().withMessage('Fecha de ingreso inválida'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

export const usuarioValidator = [
  body('empleado_id').isInt({ min: 1 }).withMessage('empleado_id inválido'),
  body('nombre_usuario').notEmpty().withMessage('Nombre de usuario requerido'),
  body('correo_electronico').isEmail().withMessage('Correo electrónico inválido'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
];

export const usuarioUpdateValidator = [
  body('empleado_id').optional().isInt({ min: 1 }).withMessage('empleado_id inválido'),
  body('nombre_usuario').optional().notEmpty().withMessage('Nombre de usuario requerido'),
  body('correo_electronico').optional().isEmail().withMessage('Correo electrónico inválido'),
  body('password').optional().isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];

export const rolValidator = [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('codigo').notEmpty().withMessage('Código requerido'),
];

export const rolUpdateValidator = [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('codigo').optional().notEmpty().withMessage('Código no puede estar vacío'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
];
