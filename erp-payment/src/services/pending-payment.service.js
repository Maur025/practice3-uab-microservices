import { db } from "../db.js";

export const findAllPendingPayments = async () => {
  const [rows] = await db.query("SELECT * FROM cuenta_por_pagar");
  return rows;
};
