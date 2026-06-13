import { db } from "../db.js";

export const findAllPendingCollections = async () => {
  const [rows] = await db.query("SELECT * FROM cuenta_por_cobrar");
  return rows;
};
