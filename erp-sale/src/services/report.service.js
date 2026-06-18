import { db } from "../db.js";
import PDFDocument from "pdfkit";

export const getRevenueReport = async ({ fecha, fecha_desde, fecha_hasta, id_sucursal } = {}) => {
  const params = [];
  const conditions = [];

  if (fecha) {
    conditions.push("DATE(v.fecha_venta) = ?");
    params.push(fecha);
  } else if (fecha_desde && fecha_hasta) {
    conditions.push("DATE(v.fecha_venta) >= ? AND DATE(v.fecha_venta) <= ?");
    params.push(fecha_desde, fecha_hasta);
  } else if (fecha_desde) {
    conditions.push("DATE(v.fecha_venta) >= ?");
    params.push(fecha_desde);
  } else if (fecha_hasta) {
    conditions.push("DATE(v.fecha_venta) <= ?");
    params.push(fecha_hasta);
  }

  if (id_sucursal) {
    conditions.push("v.id_sucursal = ?");
    params.push(id_sucursal);
  }

  let whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const [rows] = await db.query(
    `SELECT v.id_venta, v.id_sucursal, s.nombre as sucursal_nombre,
            v.fecha_venta, v.tipo_pago, v.subtotal, v.descuento, v.total,
            v.estado, f.numero_factura
     FROM venta v
     JOIN sucursal s ON v.id_sucursal = s.id_sucursal
     LEFT JOIN factura f ON v.id_venta = f.id_venta
     ${whereClause}
     ORDER BY v.fecha_venta DESC`,
    params,
  );

  const resumen = {
    total_ventas: rows.length,
    total_ingresos: 0,
    total_descuentos: 0,
    ventas_contado: 0,
    ventas_credito: 0,
    sucursales: {},
    ventas: rows,
  };

  for (const row of rows) {
    if (row.estado === "REGISTRADA") {
      resumen.total_ingresos += Number(row.total);
      resumen.total_descuentos += Number(row.descuento);
      if (row.tipo_pago === "CONTADO") resumen.ventas_contado++;
      else resumen.ventas_credito++;
    }

    if (!resumen.sucursales[row.id_sucursal]) {
      resumen.sucursales[row.id_sucursal] = { nombre: row.sucursal_nombre, total: 0, cantidad: 0 };
    }
    if (row.estado === "REGISTRADA") {
      resumen.sucursales[row.id_sucursal].total += Number(row.total);
      resumen.sucursales[row.id_sucursal].cantidad++;
    }
  }

  resumen.total_ingresos = Number(resumen.total_ingresos.toFixed(2));
  resumen.total_descuentos = Number(resumen.total_descuentos.toFixed(2));

  return resumen;
};

export const generateReportPdf = async ({ fecha, fecha_desde, fecha_hasta, id_sucursal } = {}) => {
  const data = await getRevenueReport({ fecha, fecha_desde, fecha_hasta, id_sucursal });

  const doc = new PDFDocument({ margin: 40, size: "LETTER" });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const rightX = doc.page.width - 40;

    doc.fontSize(16).font("Helvetica-Bold").text("REPORTE DE INGRESOS", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica");

    if (fecha) {
      doc.text(`Fecha: ${fecha}`, { align: "center" });
    } else if (fecha_desde && fecha_hasta) {
      doc.text(`Período: ${fecha_desde} - ${fecha_hasta}`, { align: "center" });
    } else {
      doc.text("Todos los registros", { align: "center" });
    }
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica-Bold").text("RESUMEN");
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(10);

    const labelX = 40;
    const valueX = 300;

    const addSummaryRow = (label, value) => {
      doc.text(label, labelX, doc.y, { width: 250 });
      doc.text(value, valueX, doc.y - 12, { width: 200, align: "right" });
      doc.moveDown(0.3);
    };

    addSummaryRow("Total ventas realizadas:", String(data.total_ventas));
    addSummaryRow("Ventas al contado:", String(data.ventas_contado));
    addSummaryRow("Ventas a crédito:", String(data.ventas_credito));
    addSummaryRow("Total descuentos:", `Bs ${data.total_descuentos.toFixed(2)}`);
    addSummaryRow("Total ingresos:", `Bs ${data.total_ingresos.toFixed(2)}`);

    if (Object.keys(data.sucursales).length > 0) {
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").fontSize(11).text("POR SUCURSAL");
      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(10);

      for (const s of Object.values(data.sucursales)) {
        addSummaryRow(`${s.nombre}:`, `Bs ${Number(s.total).toFixed(2)} (${s.cantidad} ventas)`);
      }
    }

    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(8).font("Helvetica").text(
      "Reporte generado electrónicamente por el sistema ERP Supermercado.",
      { align: "center" },
    );

    doc.end();
  });
};
