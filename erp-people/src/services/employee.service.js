import { db } from "../db.js";

export const findAllEmployees = async () => {
  const [rows] = await db.query("SELECT * FROM empleado");
  return rows;
};
