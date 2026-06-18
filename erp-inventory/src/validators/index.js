import { body, param, query } from "express-validator";

export const idParamValidator = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"),
];

export const categoriaValidator = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
];

export const categoriaUpdateValidator = [
  body("nombre").optional().notEmpty().withMessage("Nombre no puede estar vacío"),
];

export const unidadValidator = [
  body("nombre").notEmpty().withMessage("Nombre requerido"),
  body("abreviatura").notEmpty().withMessage("Abreviatura requerida"),
];

export const unidadUpdateValidator = [
  body("nombre").optional().notEmpty().withMessage("Nombre no puede estar vacío"),
  body("abreviatura").optional().notEmpty().withMessage("Abreviatura no puede estar vacía"),
];

export const productoValidator = [
  body("id_categoria").isInt({ min: 1 }).withMessage("Categoría inválida"),
  body("id_unidad").isInt({ min: 1 }).withMessage("Unidad inválida"),
  body("nombre").notEmpty().withMessage("Nombre requerido"),
  body("codigo").optional().isString().withMessage("Código debe ser texto"),
  body("descripcion").optional().isString().withMessage("Descripción debe ser texto"),
  body("precio_venta").isFloat({ min: 0 }).withMessage("Precio venta debe ser número positivo"),
  body("costo").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Costo debe ser número positivo"),
];

export const productoUpdateValidator = [
  body("id_categoria").optional().isInt({ min: 1 }).withMessage("Categoría inválida"),
  body("id_unidad").optional().isInt({ min: 1 }).withMessage("Unidad inválida"),
  body("nombre").optional().notEmpty().withMessage("Nombre no puede estar vacío"),
  body("codigo").optional().isString().withMessage("Código debe ser texto"),
  body("descripcion").optional().isString().withMessage("Descripción debe ser texto"),
  body("precio_venta").optional().isFloat({ min: 0 }).withMessage("Precio venta debe ser número positivo"),
  body("costo").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Costo debe ser número positivo"),
  body("estado").optional().isBoolean().withMessage("Estado debe ser booleano"),
];

export const inventarioValidator = [
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("stock_actual").optional().isFloat({ min: 0 }).withMessage("Stock actual debe ser número positivo"),
  body("stock_minimo").optional().isFloat({ min: 0 }).withMessage("Stock mínimo debe ser número positivo"),
];

export const inventarioUpdateValidator = [
  body("stock_minimo").optional().isFloat({ min: 0 }).withMessage("Stock mínimo debe ser número positivo"),
];

export const movimientoValidator = [
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("tipo_movimiento").isIn(["ENTRADA", "SALIDA", "AJUSTE"]).withMessage("Tipo movimiento inválido"),
  body("origen").isIn(["COMPRA", "VENTA", "DEVOLUCION", "AJUSTE"]).withMessage("Origen inválido"),
  body("cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad debe ser número positivo"),
  body("referencia").optional().isString().withMessage("Referencia debe ser texto"),
  body("observacion").optional().isString().withMessage("Observación debe ser texto"),
  body("costo_unitario").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Costo unitario debe ser número positivo"),
  body("precio_venta").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Precio venta debe ser número positivo"),
];

export const stockInicialValidator = [
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("productos").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("productos.*.id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("productos.*.cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad debe ser mayor a 0"),
  body("productos.*.stock_minimo").optional().isFloat({ min: 0 }).withMessage("Stock mínimo debe ser número positivo"),
  body("productos.*.costo_unitario").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Costo unitario debe ser número positivo"),
  body("productos.*.precio_venta").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Precio venta debe ser número positivo"),
];

export const transferenciaValidator = [
  body("id_sucursal_origen").isInt({ min: 1 }).withMessage("Sucursal origen inválida"),
  body("id_sucursal_destino").isInt({ min: 1 }).withMessage("Sucursal destino inválida"),
  body("productos").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto"),
  body("productos.*.id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("productos.*.cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad debe ser mayor a 0"),
];

export const sucursalQueryValidator = [
  query("id_sucursal").optional().isInt({ min: 1 }).withMessage("id_sucursal inválido"),
];

export const loteValidator = [
  body("id_producto").isInt({ min: 1 }).withMessage("Producto inválido"),
  body("id_sucursal").isInt({ min: 1 }).withMessage("Sucursal inválida"),
  body("cantidad").isFloat({ min: 0.01 }).withMessage("Cantidad debe ser mayor a 0"),
  body("costo_unitario").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Costo unitario debe ser número positivo"),
  body("precio_venta").optional({ values: "null" }).isFloat({ min: 0 }).withMessage("Precio venta debe ser número positivo"),
  body("referencia").optional().isString().withMessage("Referencia debe ser texto"),
];
