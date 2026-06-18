import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllPayments = async ({ limit, offset } = {}) => {
  let query = `SELECT pp.*, cxp.id_compra, pr.razon_social as proveedor_nombre`;
  let countQuery = "SELECT COUNT(*) as count";
  const fromClause = " FROM pago_proveedor pp JOIN cuenta_por_pagar cxp ON pp.id_cxp = cxp.id_cxp JOIN proveedor pr ON cxp.id_proveedor = pr.id_proveedor";

  query += fromClause;
  countQuery += fromClause;

  const [[{ count }]] = await db.query(countQuery);

  query += " ORDER BY pp.fecha_pago DESC";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    const [rows] = await db.query(query, [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query(query);
  return { rows, count };
};

export const registerSupplierPayment = async (paymentData) => {
  const { id_cxp, monto, metodo_pago, observacion } = paymentData;

  if (!id_cxp || !monto || monto <= 0) {
    throw new AppError("El ID de la cuenta y un monto mayor a 0 son obligatorios.", 400);
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [cuentas] = await connection.query(
      "SELECT * FROM cuenta_por_pagar WHERE id_cxp = ? FOR UPDATE",
      [id_cxp],
    );
    if (cuentas.length === 0) throw new AppError("Cuenta por pagar no encontrada", 404);

    const cuenta = cuentas[0];

    if (cuenta.estado === "PAGADA") {
      throw new AppError("Esta cuenta ya está totalmente pagada.", 400);
    }
    if (monto > cuenta.saldo) {
      throw new AppError(`El monto a pagar (${monto}) supera el saldo pendiente (${cuenta.saldo}).`, 400);
    }

    const [resultPago] = await connection.query(
      `INSERT INTO pago_proveedor (id_cxp, monto, metodo_pago, observacion, fecha_pago)
       VALUES (?, ?, ?, ?, CURDATE())`,
      [id_cxp, monto, metodo_pago || "EFECTIVO", observacion || "Pago a proveedor"],
    );

    const nuevoMontoPagado = parseFloat(cuenta.monto_pagado) + parseFloat(monto);
    const nuevoSaldo = parseFloat(cuenta.saldo) - parseFloat(monto);
    const nuevoEstado = nuevoSaldo <= 0 ? "PAGADA" : "PENDIENTE";

    await connection.query(
      "UPDATE cuenta_por_pagar SET monto_pagado = ?, saldo = ?, estado = ? WHERE id_cxp = ?",
      [nuevoMontoPagado, nuevoSaldo, nuevoEstado, id_cxp],
    );

    await connection.commit();

    return {
      id_pago_proveedor: resultPago.insertId,
      nuevo_saldo: nuevoSaldo,
      estado_cuenta: nuevoEstado,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
