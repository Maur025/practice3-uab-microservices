import { db } from "../db.js";

export const findAllBranches = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM sucursal");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM sucursal LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM sucursal");
  return { rows, count };
};
