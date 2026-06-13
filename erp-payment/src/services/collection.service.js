import { db } from "../db.js";

export const findAllCollections = async () => {
  const [rows] = await db.query("SELECT * FROM pago_cliente");
  return rows;
};
