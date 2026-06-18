import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllSales = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM venta");
  if (limit != null && offset != null) {
    const [rows] = await db.query(
      `SELECT v.*, s.nombre as sucursal_nombre, u.username as usuario_nombre
       FROM venta v
       JOIN sucursal s ON v.id_sucursal = s.id_sucursal
       JOIN usuario u ON v.id_usuario = u.id_usuario
       ORDER BY v.id_venta DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return { rows, count };
  }
  const [rows] = await db.query(
    `SELECT v.*, s.nombre as sucursal_nombre, u.username as usuario_nombre
     FROM venta v
     JOIN sucursal s ON v.id_sucursal = s.id_sucursal
     JOIN usuario u ON v.id_usuario = u.id_usuario
     ORDER BY v.id_venta DESC`,
  );
  return { rows, count };
};

export const registerSale = async (saleData) => {
  const {
    id_cliente, id_sucursal, id_usuario, tipo_pago, descuento = 0,
    nit_cliente, razon_social_cliente, carrito,
  } = saleData;

  if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
    throw new AppError("El carrito de compras es requerido y no puede estar vacío.", 400);
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const subtotal_venta = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    const total_venta = subtotal_venta - descuento;

    const [resultVenta] = await connection.query(
      `INSERT INTO venta (id_cliente, id_sucursal, id_usuario, tipo_pago, subtotal, descuento, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_cliente || null, id_sucursal, id_usuario, tipo_pago, subtotal_venta, descuento, total_venta],
    );
    const id_venta = resultVenta.insertId;

    for (const item of carrito) {
      await connection.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_venta, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario, (item.cantidad * item.precio_unitario)],
      );

      const [inventarios] = await connection.query(
        `SELECT id_inventario, stock_actual FROM inventario
         WHERE id_sucursal = ? AND id_producto = ? FOR UPDATE`,
        [id_sucursal, item.id_producto],
      );

      if (inventarios.length === 0) {
        throw new AppError(`El producto ${item.id_producto} no tiene stock registrado en esta sucursal`, 400);
      }

      const inv = inventarios[0];
      const stock_anterior = Number(inv.stock_actual);
      const stock_nuevo = stock_anterior - Number(item.cantidad);

      if (stock_nuevo < 0) {
        throw new AppError(`Stock insuficiente para el producto ${item.id_producto}. Disponible: ${stock_anterior}, solicitado: ${item.cantidad}`, 400);
      }

      await connection.query(
        `UPDATE inventario SET stock_actual = ? WHERE id_inventario = ?`,
        [stock_nuevo, inv.id_inventario],
      );

      await connection.query(
        `INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion)
         VALUES (?, ?, 'SALIDA', 'VENTA', ?, ?, ?)`,
        [id_sucursal, item.id_producto, item.cantidad, `VENTA-${id_venta}`, `Venta #${id_venta}`],
      );
    }

    const numero_factura = `F-${Date.now()}`;
    const impuesto_iva = parseFloat((total_venta * 0.13).toFixed(2));
    const subtotal_factura = parseFloat((total_venta - impuesto_iva).toFixed(2));

    const [resultFactura] = await connection.query(
      `INSERT INTO factura (id_venta, numero_factura, nit_cliente, razon_social_cliente, subtotal, impuesto, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_venta, numero_factura, nit_cliente, razon_social_cliente, subtotal_factura, impuesto_iva, total_venta],
    );
    const id_factura = resultFactura.insertId;

    for (const item of carrito) {
      await connection.query(
        `INSERT INTO detalle_factura (id_factura, id_producto, descripcion, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_factura, item.id_producto, item.descripcion, item.cantidad, item.precio_unitario, (item.cantidad * item.precio_unitario)],
      );
    }

    await connection.commit();

    if (tipo_pago === "CREDITO") {
      if (!id_cliente) {
        await db.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        await db.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        throw new AppError("El cliente es obligatorio para ventas a crédito", 400);
      }

      const cxcReq = await fetch("http://localhost:7805/api/finanzas/cuentas-por-cobrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_venta, id_cliente, monto_total: total_venta }),
      });

      if (!cxcReq.ok) {
        await db.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        await db.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        const errData = await cxcReq.json().catch(() => ({}));
        throw new AppError(`Finanzas rechazó la operación. Venta ANULADA. Motivo: ${errData.message || "Error de conexión"}`, 500);
      }
    }

    return { id_venta, numero_factura };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findSaleById = async (id) => {
  const [ventas] = await db.query(
    `SELECT v.*, s.nombre as sucursal_nombre, u.username as usuario_nombre,
            f.id_factura, f.numero_factura, f.fecha_emision, f.nit_cliente,
            f.razon_social_cliente, f.subtotal as factura_subtotal, f.impuesto,
            f.total as factura_total, f.estado as factura_estado
     FROM venta v
     JOIN sucursal s ON v.id_sucursal = s.id_sucursal
     JOIN usuario u ON v.id_usuario = u.id_usuario
     LEFT JOIN factura f ON v.id_venta = f.id_venta
     WHERE v.id_venta = ?`,
    [id],
  );

  if (ventas.length === 0) {
    throw new AppError("Venta no encontrada", 404);
  }

  const venta = ventas[0];

  const [detalles] = await db.query(
    `SELECT dv.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
            u.abreviatura as unidad_abreviatura
     FROM detalle_venta dv
     JOIN producto p ON dv.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE dv.id_venta = ?`,
    [id],
  );

  const [detallesFactura] = await db.query(
    `SELECT df.*, p.nombre as producto_nombre, p.codigo as producto_codigo
     FROM detalle_factura df
     JOIN producto p ON df.id_producto = p.id_producto
     WHERE df.id_factura = ?`,
    [venta.id_factura],
  );

  return {
    ...venta,
    detalle_ventas: detalles,
    detalle_factura: detallesFactura,
  };
};

export const annulSale = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [ventas] = await connection.query(
      "SELECT id_sucursal, estado FROM venta WHERE id_venta = ? FOR UPDATE",
      [id],
    );

    if (ventas.length === 0) {
      throw new AppError("Venta no encontrada", 404);
    }

    if (ventas[0].estado === "ANULADA") {
      throw new AppError("La venta ya se encuentra anulada", 400);
    }

    await connection.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id]);
    await connection.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id]);

    const [detalles] = await connection.query(
      "SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta = ?",
      [id],
    );

    for (const det of detalles) {
      const [inventarios] = await connection.query(
        `SELECT id_inventario, stock_actual FROM inventario
         WHERE id_sucursal = ? AND id_producto = ? FOR UPDATE`,
        [ventas[0].id_sucursal, det.id_producto],
      );

      if (inventarios.length > 0) {
        const inv = inventarios[0];
        const stock_anterior = Number(inv.stock_actual);
        const stock_nuevo = stock_anterior + Number(det.cantidad);
        await connection.query("UPDATE inventario SET stock_actual = ? WHERE id_inventario = ?", [stock_nuevo, inv.id_inventario]);
        await connection.query(
          `INSERT INTO movimiento_inventario (id_sucursal, id_producto, tipo_movimiento, origen, cantidad, referencia, observacion)
           VALUES (?, ?, 'ENTRADA', 'DEVOLUCION', ?, ?, ?)`,
          [ventas[0].id_sucursal, det.id_producto, det.cantidad, `VENTA-ANULADA-${id}`, `Devolución por anulación de venta #${id}`],
        );
      }
    }

    await connection.commit();
    return { id_venta: id, estado: "ANULADA" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
