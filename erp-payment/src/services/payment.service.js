import { db } from "../db.js";

export const findAllPayments = async () => {
  const [rows] = await db.query("SELECT * FROM pago_proveedor");
  return rows;
};
