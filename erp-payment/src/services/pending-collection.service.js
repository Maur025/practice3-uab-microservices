import { db } from "../db.js";

export const findAllPendingCollections = async () => {
  const [rows] = await db.query("SELECT * FROM cuenta_por_cobrar");
  return rows;
};

// Nuestra nueva función para registrar la cuenta por cobrar
export const registerPendingCollection = async (data) => {
  const { id_venta, id_cliente, monto_total } = data;
  
  // Al nacer la deuda, el saldo es igual al total y no hay cobros previos
  const saldo = monto_total;

  const [result] = await db.query(
    `INSERT INTO cuenta_por_cobrar (id_venta, id_cliente, monto_total, monto_cobrado, saldo, estado) 
     VALUES (?, ?, ?, 0.00, ?, 'PENDIENTE')`,
    [id_venta, id_cliente, monto_total, saldo]
  );

  return { id_cxc: result.insertId };
};