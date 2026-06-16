import { db } from "../db.js";

export const findAllSales = async () => {
  const [rows] = await db.query("SELECT * FROM venta");
  return rows;
};

// Nuestra función para registrar ventas (con prevención de Deadlocks e Impuestos)
export const registerSale = async (saleData) => {
  const {
    id_cliente, id_sucursal, id_usuario, tipo_pago, descuento = 0,
    nit_cliente, razon_social_cliente, carrito
  } = saleData;

  if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
    throw new Error("El carrito de compras es requerido y no puede estar vacío.");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Cálculos base de la venta
    const subtotal_venta = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    const total_venta = subtotal_venta - descuento;

    // 2. Insertar en tabla `venta`
    const [resultVenta] = await connection.query(
      `INSERT INTO venta (id_cliente, id_sucursal, id_usuario, tipo_pago, subtotal, descuento, total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_cliente || null, id_sucursal, id_usuario, tipo_pago, subtotal_venta, descuento, total_venta]
    );
    const id_venta = resultVenta.insertId;

    // 3. Insertar en tabla `detalle_venta`
    for (const item of carrito) {
      await connection.query(
        `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_venta, subtotal) 
         VALUES (?, ?, ?, ?, ?)`,
        [id_venta, item.id_producto, item.cantidad, item.precio_unitario, (item.cantidad * item.precio_unitario)]
      );
    }

    // 4. Generar número de factura, calcular IMPUESTO e insertar en `factura`
    const numero_factura = `F-${Date.now()}`;
    
    // Calculamos el 13% de IVA sobre el total cobrado y lo redondeamos a 2 decimales
    const impuesto_iva = parseFloat((total_venta * 0.13).toFixed(2));
    // El subtotal de la factura será el total menos el impuesto (Base Imponible)
    const subtotal_factura = parseFloat((total_venta - impuesto_iva).toFixed(2));

    const [resultFactura] = await connection.query(
      `INSERT INTO factura (id_venta, numero_factura, nit_cliente, razon_social_cliente, subtotal, impuesto, total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_venta, numero_factura, nit_cliente, razon_social_cliente, subtotal_factura, impuesto_iva, total_venta]
    );
    const id_factura = resultFactura.insertId;

    // 5. Insertar en `detalle_factura`
    for (const item of carrito) {
      await connection.query(
        `INSERT INTO detalle_factura (id_factura, id_producto, descripcion, cantidad, precio_unitario, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_factura, item.id_producto, item.descripcion, item.cantidad, item.precio_unitario, (item.cantidad * item.precio_unitario)]
      );
    }

    // 6. Confirmamos la transacción de ventas localmente PRIMERO
    await connection.commit();

    // --- INTEGRACIÓN CON MICROSERVICIOS EXTERNOS ---
    
    /*
    const inventarioReq = await fetch('http://localhost:7803/api/stock/descontar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_sucursal, carrito })
    });
    if (!inventarioReq.ok) {
        await db.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        await db.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        throw new Error('Fallo al descontar el inventario. Venta ANULADA.');
    }
    */

    // 7. LLAMADA HTTP INTERNA: Crear Cuenta por Cobrar (Solo si es a CREDITO)
    if (tipo_pago === 'CREDITO') {
      if (!id_cliente) {
        await db.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        await db.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        throw new Error('El cliente es obligatorio para ventas a crédito');
      }
      
      const cxcReq = await fetch('http://localhost:7805/api/payments/incoming/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_venta, id_cliente, monto_total: total_venta })
      });

      if (!cxcReq.ok) {
        await db.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        await db.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id_venta]);
        
        const errData = await cxcReq.json().catch(() => ({}));
        throw new Error(`Finanzas rechazó la operación. Venta ANULADA por seguridad. Motivo: ${errData.error || 'Error de conexión'}`);
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

// Obtener una venta específica con su detalle
export const findSaleById = async (id) => {
  // 1. Buscamos la cabecera de la venta
  const [ventas] = await db.query("SELECT * FROM venta WHERE id_venta = ?", [id]);
  
  if (ventas.length === 0) {
    throw new Error("Venta no encontrada");
  }

  const venta = ventas[0];

  // 2. Buscamos el detalle de los productos de esa venta
  const [detalles] = await db.query("SELECT * FROM detalle_venta WHERE id_venta = ?", [id]);

  // 3. Devolvemos la venta con un arreglo llamado "detalle_ventas"
  return {
    ...venta,
    detalle_ventas: detalles
  };
};

// Anular una venta y su factura
export const annulSale = async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Cambiamos el estado en la tabla venta y en la factura
    await connection.query("UPDATE venta SET estado = 'ANULADA' WHERE id_venta = ?", [id]);
    await connection.query("UPDATE factura SET estado = 'ANULADA' WHERE id_venta = ?", [id]);

    await connection.commit();
    return { id_venta: id, estado: 'ANULADA' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};