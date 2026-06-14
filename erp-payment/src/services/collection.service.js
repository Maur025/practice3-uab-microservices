import { db } from "../db.js";

export const findAllCollections = async () => {
  const [rows] = await db.query("SELECT * FROM pago_cliente");
  return rows;
};

// Nuestra nueva función para registrar un pago/cuota
export const registerCollection = async (paymentData) => {
  const { id_cxc, monto, metodo_pago, observacion } = paymentData;

  if (!id_cxc || !monto || monto <= 0) {
    throw new Error("El ID de la cuenta y un monto mayor a 0 son obligatorios.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Obtenemos la deuda actual (bloqueando la fila para evitar cobros dobles simultáneos)
    const [cuentas] = await connection.query(
      "SELECT * FROM cuenta_por_cobrar WHERE id_cxc = ? FOR UPDATE",
      [id_cxc]
    );

    if (cuentas.length === 0) throw new Error("Cuenta por cobrar no encontrada");

    const cuenta = cuentas[0];

    // 2. Validaciones de negocio
    if (cuenta.estado === 'PAGADA') {
      throw new Error("Esta cuenta ya está totalmente pagada.");
    }
    if (monto > cuenta.saldo) {
      throw new Error(`El monto a pagar (${monto}) supera el saldo deudor actual (${cuenta.saldo}).`);
    }

    // 3. Insertar el recibo del pago
    const [resultPago] = await connection.query(
      `INSERT INTO pago_cliente (id_cxc, monto, metodo_pago, observacion, fecha_pago) 
       VALUES (?, ?, ?, ?, CURDATE())`,
      [id_cxc, monto, metodo_pago || 'EFECTIVO', observacion || 'Pago parcial en caja']
    );

    // 4. Calcular los nuevos saldos
    const nuevoMontoCobrado = parseFloat(cuenta.monto_cobrado) + parseFloat(monto);
    const nuevoSaldo = parseFloat(cuenta.saldo) - parseFloat(monto);
    const nuevoEstado = nuevoSaldo <= 0 ? 'PAGADA' : 'PENDIENTE';

    // 5. Actualizar la cuenta por cobrar
    await connection.query(
      `UPDATE cuenta_por_cobrar 
       SET monto_cobrado = ?, saldo = ?, estado = ? 
       WHERE id_cxc = ?`,
      [nuevoMontoCobrado, nuevoSaldo, nuevoEstado, id_cxc]
    );

    await connection.commit();
    
    return { 
      id_pago_cliente: resultPago.insertId, 
      nuevo_saldo: nuevoSaldo, 
      estado_cuenta: nuevoEstado 
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};