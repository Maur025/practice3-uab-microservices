import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllInventarios = async ({ limit, offset, id_sucursal, id_producto } = {}) => {
  let query = `SELECT i.*, s.nombre as sucursal_nombre, p.nombre as producto_nombre,
               p.codigo as producto_codigo, p.costo, p.precio_venta,
               u.abreviatura as unidad_abreviatura,
               COALESCE(l.costo_promedio, 0) as costo_promedio,
               COALESCE(l.total_lotes, 0) as total_lotes`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = ` FROM inventario i
    JOIN sucursal s ON i.id_sucursal = s.id_sucursal
    JOIN producto p ON i.id_producto = p.id_producto
    JOIN unidad_medida u ON p.id_unidad = u.id_unidad
    LEFT JOIN (
      SELECT id_producto, id_sucursal,
        COUNT(*) as total_lotes,
        CASE WHEN SUM(cantidad) > 0 THEN SUM(costo_unitario * cantidad) / SUM(cantidad) ELSE 0 END as costo_promedio
      FROM producto_lote
      WHERE cantidad > 0
      GROUP BY id_producto, id_sucursal
    ) l ON i.id_producto = l.id_producto AND i.id_sucursal = l.id_sucursal`;
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
            u.abreviatura as unidad_abreviatura,
            COALESCE(l.costo_promedio, 0) as costo_promedio,
            COALESCE(l.total_lotes, 0) as total_lotes
     FROM inventario i
     JOIN sucursal s ON i.id_sucursal = s.id_sucursal
     JOIN producto p ON i.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     LEFT JOIN (
       SELECT id_producto, id_sucursal,
         COUNT(*) as total_lotes,
         CASE WHEN SUM(cantidad) > 0 THEN SUM(costo_unitario * cantidad) / SUM(cantidad) ELSE 0 END as costo_promedio
       FROM producto_lote
       WHERE cantidad > 0
       GROUP BY id_producto, id_sucursal
     ) l ON i.id_producto = l.id_producto AND i.id_sucursal = l.id_sucursal
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

// --- Helpers ---

export const recalcularStock = async (id_sucursal, id_producto) => {
  await db.query(
    `UPDATE inventario i
     SET i.stock_actual = (
       SELECT COALESCE(SUM(pl.cantidad), 0)
       FROM producto_lote pl
       WHERE pl.id_sucursal = i.id_sucursal AND pl.id_producto = i.id_producto
     )
     WHERE i.id_sucursal = ? AND i.id_producto = ?`,
    [id_sucursal, id_producto],
  );
};

export const asegurarInventarioRow = async (id_sucursal, id_producto, stock_minimo = 0) => {
  const [existing] = await db.query(
    "SELECT id_inventario FROM inventario WHERE id_sucursal = ? AND id_producto = ?",
    [id_sucursal, id_producto],
  );
  if (existing.length === 0) {
    await db.query(
      "INSERT INTO inventario (id_sucursal, id_producto, stock_actual, stock_minimo) VALUES (?, ?, 0, ?)",
      [id_sucursal, id_producto, stock_minimo],
    );
  }
};

const registrarMovimiento = async (id_sucursal, id_producto, cantidad, tipo_movimiento, origen, referencia, observacion) => {
  const [result] = await db.query(
    "INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia || null, observacion || null],
  );
  return result.insertId;
};

// --- Lotes (Lots/Batches) ---

export const findLotesByProductoSucursal = async ({ id_sucursal, id_producto, limit, offset } = {}) => {
  let query = `SELECT pl.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
               s.nombre as sucursal_nombre, u.abreviatura as unidad_abreviatura`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = ` FROM producto_lote pl
    JOIN producto p ON pl.id_producto = p.id_producto
    JOIN sucursal s ON pl.id_sucursal = s.id_sucursal
    JOIN unidad_medida u ON p.id_unidad = u.id_unidad`;
  const conditions = [];
  const params = [];
  const countParams = [];

  query += fromClause;
  countQuery += fromClause;

  if (id_sucursal) {
    conditions.push("pl.id_sucursal = ?");
    params.push(id_sucursal);
    countParams.push(id_sucursal);
  }
  if (id_producto) {
    conditions.push("pl.id_producto = ?");
    params.push(id_producto);
    countParams.push(id_producto);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    query += where;
    countQuery += where;
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY pl.fecha_ingreso ASC, pl.id_lote ASC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findLoteById = async (id) => {
  const [rows] = await db.query(
    `SELECT pl.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
            s.nombre as sucursal_nombre, u.abreviatura as unidad_abreviatura
     FROM producto_lote pl
     JOIN producto p ON pl.id_producto = p.id_producto
     JOIN sucursal s ON pl.id_sucursal = s.id_sucursal
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE pl.id_lote = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Lote no encontrado", 404);
  }
  return rows[0];
};

export const crearLote = async (data) => {
  const { id_producto, id_sucursal, cantidad, costo_unitario, precio_venta, origen, referencia } = data;

  if (!cantidad || cantidad <= 0) {
    throw new AppError("La cantidad del lote debe ser mayor a 0", 400);
  }

  await asegurarInventarioRow(id_sucursal, id_producto);

  const [result] = await db.query(
    `INSERT INTO producto_lote (id_producto, id_sucursal, cantidad, costo_unitario, precio_venta, origen, referencia)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_producto, id_sucursal, cantidad, costo_unitario ?? null, precio_venta ?? null, origen || 'AJUSTE', referencia || null],
  );

  if (precio_venta != null) {
    await db.query(
      "UPDATE producto SET precio_venta = ? WHERE id_producto = ?",
      [precio_venta, id_producto],
    );
  }

  if (costo_unitario != null) {
    const [lotesActivos] = await db.query(
      `SELECT COALESCE(SUM(pl.cantidad * pl.costo_unitario), 0) as costo_total,
              COALESCE(SUM(pl.cantidad), 0) as cantidad_total
       FROM producto_lote pl
       WHERE pl.id_producto = ? AND pl.id_sucursal = ? AND pl.cantidad > 0`,
      [id_producto, id_sucursal],
    );
    const { costo_total, cantidad_total } = lotesActivos[0];
    const costoPromedio = cantidad_total > 0 ? costo_total / cantidad_total : costo_unitario;
    await db.query(
      "UPDATE producto SET costo = ? WHERE id_producto = ?",
      [costoPromedio, id_producto],
    );
  }

  await recalcularStock(id_sucursal, id_producto);

  return findLoteById(result.insertId);
};

export const descontarStockDeLotes = async (id_sucursal, id_producto, cantidadTotal) => {
  const [lotes] = await db.query(
    `SELECT id_lote, cantidad, costo_unitario
     FROM producto_lote
     WHERE id_sucursal = ? AND id_producto = ? AND cantidad > 0
     ORDER BY fecha_ingreso ASC, id_lote ASC`,
    [id_sucursal, id_producto],
  );

  if (lotes.length === 0) {
    throw new AppError(`No hay lotes disponibles para el producto ${id_producto} en la sucursal`, 400);
  }

  let pendiente = Number(cantidadTotal);
  let costoTotalDescontado = 0;

  for (const lote of lotes) {
    if (pendiente <= 0) break;

    const disponible = Number(lote.cantidad);
    const aDescontar = Math.min(disponible, pendiente);

    await db.query(
      "UPDATE producto_lote SET cantidad = cantidad - ? WHERE id_lote = ?",
      [aDescontar, lote.id_lote],
    );

    costoTotalDescontado += (aDescontar * Number(lote.costo_unitario || 0));
    pendiente -= aDescontar;
  }

  if (pendiente > 0) {
    throw new AppError(`Stock insuficiente para el producto ${id_producto} en la sucursal`, 400);
  }

  await recalcularStock(id_sucursal, id_producto);

  return costoTotalDescontado;
};

export const reponerStockALotes = async (id_sucursal, id_producto, cantidadTotal, origen, referencia) => {
  await crearLote({
    id_producto,
    id_sucursal,
    cantidad: cantidadTotal,
    origen,
    referencia,
  });
};

// --- Stock Operations ---

export const inicializarStock = async (id_sucursal, productos, observacion) => {
  const movimientos = [];

  for (const item of productos) {
    const { id_producto, cantidad, stock_minimo, costo_unitario, precio_venta } = item;

    await asegurarInventarioRow(id_sucursal, id_producto, stock_minimo ?? 0);

    if (stock_minimo != null) {
      await db.query(
        "UPDATE inventario SET stock_minimo = GREATEST(stock_minimo, ?) WHERE id_sucursal = ? AND id_producto = ?",
        [stock_minimo, id_sucursal, id_producto],
      );
    }

    const lote = await crearLote({
      id_producto,
      id_sucursal,
      cantidad,
      costo_unitario,
      precio_venta,
      origen: 'INICIAL',
      referencia: observacion || 'INICIAL-STOCK',
    });

    const movId = await registrarMovimiento(
      id_sucursal, id_producto, cantidad, 'ENTRADA',
      'AJUSTE', 'INICIAL-STOCK', observacion || 'Inicialización de stock',
    );
    movimientos.push({ id_movimiento: movId, id_lote: lote.id_lote });
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

    const costoDescontado = await descontarStockDeLotes(
      id_sucursal_origen, id_producto, cantidad,
    );

    const movIdOrigen = await registrarMovimiento(
      id_sucursal_origen, id_producto, cantidad, 'SALIDA',
      'AJUSTE', `TRANSFERENCIA-${id_sucursal_destino}`,
      `Transferencia a sucursal ${id_sucursal_destino}`,
    );
    movimientos.push(movIdOrigen);

    await crearLote({
      id_producto,
      id_sucursal: id_sucursal_destino,
      cantidad,
      costo_unitario: costoDescontado > 0 && cantidad > 0 ? costoDescontado / cantidad : null,
      origen: 'TRANSFERENCIA',
      referencia: `TRANSFERENCIA-${id_sucursal_origen}`,
    });

    const movIdDestino = await registrarMovimiento(
      id_sucursal_destino, id_producto, cantidad, 'ENTRADA',
      'AJUSTE', `TRANSFERENCIA-${id_sucursal_origen}`,
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
               COALESCE(i.stock_actual, 0) as stock_actual, COALESCE(i.stock_minimo, 0) as stock_minimo,
               COALESCE(l.costo_promedio, 0) as costo_promedio`;
  const params = [];
  const conditions = [];
  const joinClause = ` FROM sucursal s
    JOIN empresa e ON s.id_empresa = e.id_empresa
    JOIN producto p ON 1=1
    LEFT JOIN inventario i ON i.id_sucursal = s.id_sucursal AND i.id_producto = p.id_producto
    LEFT JOIN unidad_medida u ON p.id_unidad = u.id_unidad
    LEFT JOIN (
      SELECT id_producto, id_sucursal,
        CASE WHEN SUM(cantidad) > 0 THEN SUM(costo_unitario * cantidad) / SUM(cantidad) ELSE 0 END as costo_promedio
      FROM producto_lote
      WHERE cantidad > 0
      GROUP BY id_producto, id_sucursal
    ) l ON p.id_producto = l.id_producto AND s.id_sucursal = l.id_sucursal`;

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

export { registrarMovimiento };
