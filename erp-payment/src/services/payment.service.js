import { db } from "../db.js";

export const findAllPayments = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM pago_proveedor");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM pago_proveedor LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM pago_proveedor");
  return { rows, count };
};
