import { db } from "../db.js";

export const getCustomerStats = async (id_cliente, { id_sucursal } = {}) => {
  const params = [id_cliente];
  let sucursalFilter = "";
  if (id_sucursal) {
    sucursalFilter = " AND v.id_sucursal = ?";
    params.push(id_sucursal);
  }

  const [ventas] = await db.query(
    `SELECT v.id_venta, v.id_sucursal, s.nombre as sucursal_nombre,
            v.fecha_venta, v.total, v.tipo_pago
     FROM venta v
     JOIN sucursal s ON v.id_sucursal = s.id_sucursal
     WHERE v.id_cliente = ? AND v.estado = 'REGISTRADA'${sucursalFilter}
     ORDER BY v.fecha_venta DESC`,
    params,
  );

  if (ventas.length === 0) {
    return {
      total_compras: 0,
      total_gastado: 0,
      ticket_promedio: 0,
      frecuencia_compras: "Sin compras",
      primera_compra: null,
      ultima_compra: null,
      sucursal_preferida: null,
      producto_mas_consumido: null,
      compras_por_sucursal: [],
      ultimas_compras: [],
    };
  }

  const totalGastado = ventas.reduce((acc, v) => acc + Number(v.total), 0);
  const ticketPromedio = totalGastado / ventas.length;

  const sucursalCount = {};
  for (const v of ventas) {
    sucursalCount[v.id_sucursal] = (sucursalCount[v.id_sucursal] || 0) + 1;
  }
  const sucursalPreferidaId = Object.keys(sucursalCount).reduce((a, b) =>
    sucursalCount[a] > sucursalCount[b] ? a : b,
  );
  const sucursalPreferida = ventas.find((v) => v.id_sucursal === Number(sucursalPreferidaId));

  const [productos] = await db.query(
    `SELECT dv.id_producto, p.nombre as producto_nombre,
            SUM(dv.cantidad) as total_cantidad,
            COUNT(DISTINCT dv.id_venta) as veces_comprado
     FROM detalle_venta dv
     JOIN venta v ON dv.id_venta = v.id_venta
     JOIN producto p ON dv.id_producto = p.id_producto
     WHERE v.id_cliente = ? AND v.estado = 'REGISTRADA'${sucursalFilter}
     GROUP BY dv.id_producto, p.nombre
     ORDER BY total_cantidad DESC
     LIMIT 1`,
    params,
  );

  const firstDate = ventas[ventas.length - 1].fecha_venta;
  const lastDate = ventas[0].fecha_venta;
  const daysDiff = Math.max(1, Math.round((new Date(lastDate) - new Date(firstDate)) / (1000 * 60 * 60 * 24)));
  const frequency = ventas.length > 1
    ? `Cada ${Math.round(daysDiff / (ventas.length - 1))} días`
    : "Una sola compra";

  const comprasPorSucursal = Object.entries(sucursalCount).map(([id, cantidad]) => {
    const s = ventas.find((v) => v.id_sucursal === Number(id));
    const total = ventas.filter((v) => v.id_sucursal === Number(id)).reduce((acc, v) => acc + Number(v.total), 0);
    return { id_sucursal: Number(id), nombre: s.sucursal_nombre, cantidad_compras: cantidad, total_gastado: Number(total.toFixed(2)) };
  });

  return {
    total_compras: ventas.length,
    total_gastado: Number(totalGastado.toFixed(2)),
    ticket_promedio: Number(ticketPromedio.toFixed(2)),
    frecuencia_compras: frequency,
    primera_compra: firstDate,
    ultima_compra: lastDate,
    sucursal_preferida: sucursalPreferida ? { id: sucursalPreferida.id_sucursal, nombre: sucursalPreferida.sucursal_nombre } : null,
    producto_mas_consumido: productos.length > 0
      ? { id: productos[0].id_producto, nombre: productos[0].producto_nombre, total_cantidad: Number(productos[0].total_cantidad) }
      : null,
    compras_por_sucursal: comprasPorSucursal,
    ultimas_compras: ventas.slice(0, 10),
  };
};

export const getTopCustomers = async ({ id_sucursal, limit = 10 } = {}) => {
  const params = [];
  let sucursalFilter = "";
  if (id_sucursal) {
    sucursalFilter = " AND v.id_sucursal = ?";
    params.push(id_sucursal);
  }
  params.push(limit);

  const [rows] = await db.query(
    `SELECT v.id_cliente, c.nombres, c.apellidos, c.documento_identidad,
            COUNT(v.id_venta) as total_compras,
            SUM(v.total) as total_gastado,
            MAX(v.fecha_venta) as ultima_compra
     FROM venta v
     JOIN cliente c ON v.id_cliente = c.id_cliente
     WHERE v.id_cliente IS NOT NULL AND v.estado = 'REGISTRADA'${sucursalFilter}
     GROUP BY v.id_cliente, c.nombres, c.apellidos, c.documento_identidad
     ORDER BY total_gastado DESC
     LIMIT ?`,
    params,
  );

  return rows;
};
