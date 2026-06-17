import { db } from "../db.js";

export const findAllPendingPayments = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM cuenta_por_pagar");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM cuenta_por_pagar LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM cuenta_por_pagar");
  return { rows, count };
};
