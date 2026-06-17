import { db } from "../db.js";

export const findAllProducts = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM producto");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM producto LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM producto");
  return { rows, count };
};
