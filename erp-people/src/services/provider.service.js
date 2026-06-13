import { db } from "../db.js";

export const findAllProviders = async () => {
  const [rows] = await db.query("SELECT * FROM proveedor");
  return rows;
};
