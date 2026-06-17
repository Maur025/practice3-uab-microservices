import { db } from "../db.js";

export const findAllPurchases = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM compra");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM compra LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM compra");
  return { rows, count };
};
