import { db } from "../db.js";

export const findAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM producto");
  return rows;
};
