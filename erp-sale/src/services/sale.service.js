import { db } from "../db.js";

export const findAllSales = async () => {
  const [rows] = await db.query("SELECT * FROM venta");
  return rows;
};
