import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllMovimientos = async ({ limit, offset, id_sucursal, id_producto, tipo_movimiento, fecha_desde, fecha_hasta } = {}) => {
  let query = `SELECT m.*, s.nombre as sucursal_nombre, p.nombre as producto_nombre,
               p.codigo as producto_codigo, u.abreviatura as unidad_abreviatura`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM movimiento_inventario m JOIN sucursal s ON m.id_sucursal = s.id_sucursal JOIN producto p ON m.id_producto = p.id_producto JOIN unidad_medida u ON p.id_unidad = u.id_unidad";
  const conditions = [];
  const params = [];
  const countParams = [];

  query += fromClause;
  countQuery += fromClause;

  if (id_sucursal) {
    conditions.push("m.id_sucursal = ?");
    params.push(id_sucursal);
    countParams.push(id_sucursal);
  }
  if (id_producto) {
    conditions.push("m.id_producto = ?");
    params.push(id_producto);
    countParams.push(id_producto);
  }
  if (tipo_movimiento) {
    conditions.push("m.tipo_movimiento = ?");
    params.push(tipo_movimiento);
    countParams.push(tipo_movimiento);
  }
  if (fecha_desde) {
    conditions.push("m.fecha_movimiento >= ?");
    params.push(fecha_desde);
    countParams.push(fecha_desde);
  }
  if (fecha_hasta) {
    conditions.push("m.fecha_movimiento <= ?");
    params.push(fecha_hasta);
    countParams.push(fecha_hasta);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    query += where;
    countQuery += where;
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY m.fecha_movimiento DESC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findMovimientoById = async (id) => {
  const [rows] = await db.query(
    `SELECT m.*, s.nombre as sucursal_nombre, p.nombre as producto_nombre,
            p.codigo as producto_codigo, u.abreviatura as unidad_abreviatura
     FROM movimiento_inventario m
     JOIN sucursal s ON m.id_sucursal = s.id_sucursal
     JOIN producto p ON m.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE m.id_movimiento = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Movimiento no encontrado", 404);
  }
  return rows[0];
};

export const createMovimiento = async (data) => {
  const { id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion } = data;

  const signo = tipo_movimiento === "ENTRADA" ? "+" : "-";
  await db.query(
    `UPDATE inventario SET stock_actual = stock_actual ${signo} ? WHERE id_sucursal = ? AND id_producto = ?`,
    [cantidad, id_sucursal, id_producto],
  );

  const [result] = await db.query(
    "INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia || null, observacion || null],
  );

  return findMovimientoById(result.insertId);
};
