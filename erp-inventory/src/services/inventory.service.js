import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllInventarios = async ({ limit, offset, id_sucursal, id_producto } = {}) => {
  let query = `SELECT i.*, s.nombre as sucursal_nombre, p.nombre as producto_nombre,
               p.codigo as producto_codigo, p.costo, p.precio_venta,
               u.abreviatura as unidad_abreviatura`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM inventario i JOIN sucursal s ON i.id_sucursal = s.id_sucursal JOIN producto p ON i.id_producto = p.id_producto JOIN unidad_medida u ON p.id_unidad = u.id_unidad";
  const conditions = [];
  const params = [];
  const countParams = [];

  query += fromClause;
  countQuery += fromClause;

  if (id_sucursal) {
    conditions.push("i.id_sucursal = ?");
    params.push(id_sucursal);
    countParams.push(id_sucursal);
  }
  if (id_producto) {
    conditions.push("i.id_producto = ?");
    params.push(id_producto);
    countParams.push(id_producto);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    query += where;
    countQuery += where;
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY s.nombre, p.nombre";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findInventarioById = async (id) => {
  const [rows] = await db.query(
    `SELECT i.*, s.nombre as sucursal_nombre, p.nombre as producto_nombre,
            p.codigo as producto_codigo, p.costo, p.precio_venta,
            u.abreviatura as unidad_abreviatura
     FROM inventario i
     JOIN sucursal s ON i.id_sucursal = s.id_sucursal
     JOIN producto p ON i.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE i.id_inventario = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Inventario no encontrado", 404);
  }
  return rows[0];
};

export const createInventario = async (data) => {
  const { id_sucursal, id_producto, stock_actual, stock_minimo } = data;
  const [result] = await db.query(
    "INSERT INTO inventario (id_sucursal, id_producto, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)",
    [id_sucursal, id_producto, stock_actual ?? 0, stock_minimo ?? 0],
  );
  return findInventarioById(result.insertId);
};

export const updateInventario = async (id, data) => {
  await findInventarioById(id);
  const fields = [];
  const values = [];

  if (data.stock_actual !== undefined) {
    fields.push("stock_actual = ?");
    values.push(data.stock_actual);
  }
  if (data.stock_minimo !== undefined) {
    fields.push("stock_minimo = ?");
    values.push(data.stock_minimo);
  }

  if (fields.length === 0) return findInventarioById(id);

  values.push(id);
  await db.query(`UPDATE inventario SET ${fields.join(", ")} WHERE id_inventario = ?`, values);
  return findInventarioById(id);
};

export const deleteInventario = async (id) => {
  await findInventarioById(id);
  await db.query("DELETE FROM inventario WHERE id_inventario = ?", [id]);
};

export const ajustarStock = async (id_sucursal, id_producto, cantidad, operacion, origen, referencia, observacion) => {
  const signo = operacion === "SUMA" ? "+" : "-";
  await db.query(
    `UPDATE inventario SET stock_actual = stock_actual ${signo} ? WHERE id_sucursal = ? AND id_producto = ?`,
    [cantidad, id_sucursal, id_producto],
  );

  const tipoMovimiento = operacion === "SUMA" ? "ENTRADA" : "SALIDA";
  const [result] = await db.query(
    "INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id_sucursal, id_producto, tipoMovimiento, origen, cantidad, referencia || null, observacion || null],
  );

  return result.insertId;
};

export const inicializarStock = async (id_sucursal, productos, observacion) => {
  const movimientos = [];

  for (const item of productos) {
    const { id_producto, cantidad, stock_minimo } = item;

    const [existing] = await db.query(
      "SELECT id_inventario FROM inventario WHERE id_sucursal = ? AND id_producto = ?",
      [id_sucursal, id_producto],
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE inventario SET stock_actual = stock_actual + ?, stock_minimo = GREATEST(stock_minimo, ?)  WHERE id_sucursal = ? AND id_producto = ?",
        [cantidad, stock_minimo ?? 0, id_sucursal, id_producto],
      );
    } else {
      await db.query(
        "INSERT INTO inventario (id_sucursal, id_producto, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)",
        [id_sucursal, id_producto, cantidad, stock_minimo ?? 0],
      );
    }

    const movId = await ajustarStock(
      id_sucursal, id_producto, cantidad, "SUMA",
      "AJUSTE", "INICIAL-STOCK", observacion || "Inicialización de stock",
    );
    movimientos.push(movId);
  }

  return movimientos;
};

export const transferirStock = async (id_sucursal_origen, id_sucursal_destino, productos) => {
  if (id_sucursal_origen === id_sucursal_destino) {
    throw new AppError("Las sucursales de origen y destino deben ser diferentes", 400);
  }

  const movimientos = [];

  for (const item of productos) {
    const { id_producto, cantidad } = item;

    const [inventarioOrigen] = await db.query(
      "SELECT stock_actual FROM inventario WHERE id_sucursal = ? AND id_producto = ?",
      [id_sucursal_origen, id_producto],
    );

    if (inventarioOrigen.length === 0 || inventarioOrigen[0].stock_actual < cantidad) {
      throw new AppError(`Stock insuficiente del producto ${id_producto} en sucursal origen`, 400);
    }

    await db.query(
      "UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_sucursal = ? AND id_producto = ?",
      [cantidad, id_sucursal_origen, id_producto],
    );

    await ajustarStock(
      id_sucursal_origen, id_producto, cantidad, "RESTA",
      "AJUSTE", `TRANSFERENCIA-${id_sucursal_destino}`,
      `Transferencia a sucursal ${id_sucursal_destino}`,
    );

    const [existingDestino] = await db.query(
      "SELECT id_inventario FROM inventario WHERE id_sucursal = ? AND id_producto = ?",
      [id_sucursal_destino, id_producto],
    );

    if (existingDestino.length > 0) {
      await db.query(
        "UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_sucursal = ? AND id_producto = ?",
        [cantidad, id_sucursal_destino, id_producto],
      );
    } else {
      await db.query(
        "INSERT INTO inventario (id_sucursal, id_producto, stock_actual, stock_minimo) VALUES (?, ?, ?, 0)",
        [id_sucursal_destino, id_producto, cantidad],
      );
    }

    const movIdDestino = await ajustarStock(
      id_sucursal_destino, id_producto, cantidad, "SUMA",
      "AJUSTE", `TRANSFERENCIA-${id_sucursal_origen}`,
      `Transferencia desde sucursal ${id_sucursal_origen}`,
    );
    movimientos.push(movIdDestino);
  }

  return movimientos;
};

export const reporteStockPorEmpresa = async (id_empresa, id_producto) => {
  let query = `SELECT s.id_empresa, e.nombre as empresa_nombre,
               s.id_sucursal, s.nombre as sucursal_nombre,
               p.id_producto, p.nombre as producto_nombre, p.codigo as producto_codigo,
               p.costo, p.precio_venta, u.abreviatura as unidad_abreviatura,
               COALESCE(i.stock_actual, 0) as stock_actual, COALESCE(i.stock_minimo, 0) as stock_minimo`;
  const params = [];
  const conditions = [];
  const joinClause = " FROM sucursal s JOIN empresa e ON s.id_empresa = e.id_empresa JOIN producto p ON 1=1 LEFT JOIN inventario i ON i.id_sucursal = s.id_sucursal AND i.id_producto = p.id_producto LEFT JOIN unidad_medida u ON p.id_unidad = u.id_unidad";

  query += joinClause;

  if (id_empresa) {
    conditions.push("s.id_empresa = ?");
    params.push(id_empresa);
  }
  if (id_producto) {
    conditions.push("p.id_producto = ?");
    params.push(id_producto);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY e.nombre, s.nombre, p.nombre";

  const [rows] = await db.query(query, params);
  return rows;
};
