import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllPurchases = async ({ limit, offset, id_proveedor, id_sucursal, fecha_desde, fecha_hasta } = {}) => {
  let query = `SELECT c.*, pr.razon_social as proveedor_nombre, s.nombre as sucursal_nombre,
               u.username as usuario_username`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM compra c JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor JOIN sucursal s ON c.id_sucursal = s.id_sucursal JOIN usuario u ON c.id_usuario = u.id_usuario";
  const conditions = [];
  const params = [];
  const countParams = [];

  query += fromClause;
  countQuery += fromClause;

  if (id_proveedor) {
    conditions.push("c.id_proveedor = ?");
    params.push(id_proveedor);
    countParams.push(id_proveedor);
  }
  if (id_sucursal) {
    conditions.push("c.id_sucursal = ?");
    params.push(id_sucursal);
    countParams.push(id_sucursal);
  }
  if (fecha_desde) {
    conditions.push("c.fecha_compra >= ?");
    params.push(fecha_desde);
    countParams.push(fecha_desde);
  }
  if (fecha_hasta) {
    conditions.push("c.fecha_compra <= ?");
    params.push(fecha_hasta);
    countParams.push(fecha_hasta);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    query += where;
    countQuery += where;
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY c.fecha_compra DESC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findPurchaseById = async (id) => {
  const [rows] = await db.query(
    `SELECT c.*, pr.razon_social as proveedor_nombre, pr.nit as proveedor_nit,
            s.nombre as sucursal_nombre, u.username as usuario_username
     FROM compra c
     JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor
     JOIN sucursal s ON c.id_sucursal = s.id_sucursal
     JOIN usuario u ON c.id_usuario = u.id_usuario
     WHERE c.id_compra = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Compra no encontrada", 404);
  }

  const [detalles] = await db.query(
    `SELECT dc.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
            u.abreviatura as unidad_abreviatura
     FROM detalle_compra dc
     JOIN producto p ON dc.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE dc.id_compra = ?`,
    [id],
  );

  const [cxp] = await db.query(
    "SELECT id_cxp, monto_total, saldo, estado FROM cuenta_por_pagar WHERE id_compra = ?",
    [id],
  );

  return { ...rows[0], detalles, cuenta_por_pagar: cxp[0] || null };
};

export const createPurchase = async (data) => {
  const { id_proveedor, id_sucursal, id_usuario, tipo_pago, detalles } = data;

  if (!detalles || detalles.length === 0) {
    throw new AppError("La compra debe incluir al menos un producto", 400);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let subtotal = 0;
    const lineItems = [];

    for (const item of detalles) {
      const { id_producto, cantidad, precio_compra } = item;
      const lineSubtotal = cantidad * precio_compra;
      subtotal += lineSubtotal;
      lineItems.push({ id_producto, cantidad, precio_compra, subtotal: lineSubtotal });
    }

    const total = subtotal;

    const [result] = await connection.query(
      "INSERT INTO compra (id_proveedor, id_sucursal, id_usuario, tipo_pago, subtotal, total) VALUES (?, ?, ?, ?, ?, ?)",
      [id_proveedor, id_sucursal, id_usuario, tipo_pago, subtotal, total],
    );
    const id_compra = result.insertId;

    for (const item of lineItems) {
      await connection.query(
        "INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_compra, subtotal) VALUES (?, ?, ?, ?, ?)",
        [id_compra, item.id_producto, item.cantidad, item.precio_compra, item.subtotal],
      );

      const [existing] = await connection.query(
        "SELECT id_inventario, stock_actual FROM inventario WHERE id_sucursal = ? AND id_producto = ? FOR UPDATE",
        [id_sucursal, item.id_producto],
      );

      if (existing.length > 0) {
        await connection.query(
          "UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_sucursal = ? AND id_producto = ?",
          [item.cantidad, id_sucursal, item.id_producto],
        );
      } else {
        await connection.query(
          "INSERT INTO inventario (id_sucursal, id_producto, stock_actual, stock_minimo) VALUES (?, ?, ?, 0)",
          [id_sucursal, item.id_producto, item.cantidad],
        );
      }

      await connection.query(
        "INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion) VALUES (?, ?, 'ENTRADA', 'COMPRA', ?, ?, ?)",
        [id_sucursal, item.id_producto, item.cantidad, `COMPRA-${id_compra}`, `Compra #${id_compra}`],
      );
    }

    await connection.commit();

    if (tipo_pago === "CREDITO") {
      try {
        const response = await fetch(`http://localhost:7805/api/finanzas/cuentas-por-pagar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_compra,
            id_proveedor,
            monto_total: total,
          }),
        });

        if (!response.ok) {
          throw new Error("Finanzas rechazó la creación de CxP");
        }
      } catch {
        const conn2 = await db.getConnection();
        try {
          await conn2.beginTransaction();
          await conn2.query("UPDATE compra SET estado = 'ANULADA' WHERE id_compra = ?", [id_compra]);
          await conn2.commit();
        } finally {
          conn2.release();
        }
        throw new AppError("No se pudo crear la cuenta por pagar. La compra ha sido anulada.", 500);
      }
    }

    return findPurchaseById(id_compra);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const annulPurchase = async (id) => {
  const purchase = await findPurchaseById(id);

  if (purchase.estado === "ANULADA") {
    throw new AppError("La compra ya está anulada", 400);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE compra SET estado = 'ANULADA' WHERE id_compra = ?",
      [id],
    );

    const [detalles] = await connection.query(
      "SELECT id_producto, cantidad FROM detalle_compra WHERE id_compra = ?",
      [id],
    );

    for (const item of detalles) {
      await connection.query(
        "UPDATE inventario SET stock_actual = stock_actual - ? WHERE id_sucursal = ? AND id_producto = ?",
        [item.cantidad, purchase.id_sucursal, item.id_producto],
      );

      await connection.query(
        "INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion) VALUES (?, ?, 'SALIDA', 'DEVOLUCION', ?, ?, ?)",
        [purchase.id_sucursal, item.id_producto, item.cantidad, `COMPRA-ANULADA-${id}`, `Compra #${id} anulada`],
      );
    }

    if (purchase.cuenta_por_pagar) {
      await connection.query(
        "UPDATE cuenta_por_pagar SET estado = 'PAGADA', saldo = 0 WHERE id_compra = ?",
        [id],
      );
    }

    await connection.commit();
    return { id_compra: id, estado: "ANULADA" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
