import { db } from "../db.js";

export const findAllPurchases = async () => {
  const [rows] = await db.query("SELECT * FROM compra");
  return rows;
};
