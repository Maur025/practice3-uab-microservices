import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllPendingCollections = async ({ limit, offset } = {}) => {
  let query = `SELECT cxc.*, cl.nombres, cl.apellidos, cl.nit_ci`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM cuenta_por_cobrar cxc JOIN cliente cl ON cxc.id_cliente = cl.id_cliente";

  query += fromClause;
  countQuery += fromClause;

  const [[{ count }]] = await db.query(countQuery);

  query += " ORDER BY cxc.fecha_registro DESC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    const [rows] = await db.query(query, [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query(query);
  return { rows, count };
};

export const findPendingCollectionById = async (id) => {
  const [rows] = await db.query(
    `SELECT cxc.*, cl.nombres, cl.apellidos, cl.nit_ci
     FROM cuenta_por_cobrar cxc
     JOIN cliente cl ON cxc.id_cliente = cl.id_cliente
     WHERE cxc.id_cxc = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Cuenta por cobrar no encontrada", 404);
  }

  const [pagos] = await db.query(
    "SELECT * FROM pago_cliente WHERE id_cxc = ? ORDER BY fecha_pago DESC",
    [id],
  );

  return { ...rows[0], pagos };
};

export const registerPendingCollection = async (data) => {
  const { id_venta, id_cliente, monto_total } = data;

  const saldo = monto_total;

  const [result] = await db.query(
    `INSERT INTO cuenta_por_cobrar (id_venta, id_cliente, monto_total, monto_cobrado, saldo, estado) 
     VALUES (?, ?, ?, 0.00, ?, 'PENDIENTE')`,
    [id_venta, id_cliente, monto_total, saldo]
  );

  return { id_cxc: result.insertId };
};