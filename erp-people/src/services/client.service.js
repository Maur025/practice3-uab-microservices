import { db } from "../db.js";

export const findAllClients = async () => {
  const [rows] = await db.query("SELECT * FROM cliente");
  return rows;
};
