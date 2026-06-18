import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllPendingPayments = async ({ limit, offset } = {}) => {
  let query = `SELECT cxp.*, pr.razon_social as proveedor_nombre, pr.nit as proveedor_nit`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM cuenta_por_pagar cxp JOIN proveedor pr ON cxp.id_proveedor = pr.id_proveedor";

  query += fromClause;
  countQuery += fromClause;

  const [[{ count }]] = await db.query(countQuery);

  query += " ORDER BY cxp.fecha_registro DESC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    const [rows] = await db.query(query, [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query(query);
  return { rows, count };
};

export const findPendingPaymentById = async (id) => {
  const [rows] = await db.query(
    `SELECT cxp.*, pr.razon_social as proveedor_nombre, pr.nit as proveedor_nit
     FROM cuenta_por_pagar cxp
     JOIN proveedor pr ON cxp.id_proveedor = pr.id_proveedor
     WHERE cxp.id_cxp = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Cuenta por pagar no encontrada", 404);
  }

  const [pagos] = await db.query(
    "SELECT * FROM pago_proveedor WHERE id_cxp = ? ORDER BY fecha_pago DESC",
    [id],
  );

  return { ...rows[0], pagos };
};

export const registerPendingPayment = async (data) => {
  const { id_compra, id_proveedor, monto_total } = data;
  const saldo = monto_total;
  const [result] = await db.query(
    `INSERT INTO cuenta_por_pagar (id_compra, id_proveedor, monto_total, monto_pagado, saldo, estado)
     VALUES (?, ?, ?, 0.00, ?, 'PENDIENTE')`,
    [id_compra, id_proveedor, monto_total, saldo],
  );
  return { id_cxp: result.insertId };
};
