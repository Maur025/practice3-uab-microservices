import { db } from "../db.js";

export const findAllBranches = async () => {
  const [rows] = await db.query("SELECT * FROM sucursal");
  return rows;
};
