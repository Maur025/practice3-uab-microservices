import PDFDocument from "pdfkit";
import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const generateInvoicePdf = async (id_venta) => {
  const [ventas] = await db.query(
    `SELECT v.*, f.id_factura, f.numero_factura, f.fecha_emision,
            f.nit_cliente, f.razon_social_cliente, f.subtotal as factura_subtotal,
            f.impuesto, f.total as factura_total, f.estado as factura_estado,
            s.nombre as sucursal_nombre, s.direccion as sucursal_direccion,
            u.username as usuario_nombre,
            cl.nombres as cliente_nombres, cl.apellidos as cliente_apellidos
     FROM venta v
     JOIN factura f ON v.id_venta = f.id_venta
     JOIN sucursal s ON v.id_sucursal = s.id_sucursal
     JOIN usuario u ON v.id_usuario = u.id_usuario
     LEFT JOIN cliente cl ON v.id_cliente = cl.id_cliente
     WHERE v.id_venta = ?`,
    [id_venta],
  );

  if (ventas.length === 0) {
    throw new AppError("Venta o factura no encontrada", 404);
  }

  const venta = ventas[0];

  const [detalles] = await db.query(
    `SELECT df.*, p.nombre as producto_nombre, p.codigo as producto_codigo,
            u.abreviatura as unidad_abreviatura
     FROM detalle_factura df
     JOIN producto p ON df.id_producto = p.id_producto
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE df.id_factura = ?`,
    [venta.id_factura],
  );

  const doc = new PDFDocument({ margin: 40, size: "LETTER" });
  const buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const rightX = doc.page.width - 40;

    doc.fontSize(18).font("Helvetica-Bold").text("FACTURA", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica").text(`N° ${venta.numero_factura}`, { align: "center" });
    doc.moveDown(0.3);

    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(10).font("Helvetica-Bold").text("SUCURSAL:");
    doc.font("Helvetica").text(`${venta.sucursal_nombre} - ${venta.sucursal_direccion || ""}`);
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("FECHA EMISIÓN:");
    doc.font("Helvetica").text(new Date(venta.fecha_emision).toLocaleDateString("es-BO"));
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("CLIENTE:");
    const clienteNombre = venta.cliente_nombres
      ? `${venta.cliente_nombres} ${venta.cliente_apellidos || ""}`
      : "Consumidor Final";
    doc.font("Helvetica").text(clienteNombre);
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("NIT/CI:");
    doc.font("Helvetica").text(venta.nit_cliente || "S/N");
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold").text("USUARIO:");
    doc.font("Helvetica").text(venta.usuario_nombre);
    doc.moveDown(0.5);

    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 100;
    const col3 = 310;
    const col4 = 370;
    const col5 = 460;

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Código", col1, tableTop);
    doc.text("Producto", col2, tableTop);
    doc.text("Cant.", col3, tableTop);
    doc.text("P.Unit.", col4, tableTop);
    doc.text("Subtotal", col5, tableTop);
    doc.moveDown(0.3);

    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.3);

    doc.font("Helvetica").fontSize(9);
    let yPos = doc.y;

    for (const item of detalles) {
      if (yPos > doc.page.height - 100) {
        doc.addPage();
        yPos = 40;
      }

      doc.text(item.producto_codigo || "", col1, yPos);
      doc.text(item.descripcion, col2, yPos, { width: 200 });
      doc.text(String(item.cantidad), col3, yPos, { width: 50, align: "right" });
      doc.text(`Bs ${Number(item.precio_unitario).toFixed(2)}`, col4, yPos, { width: 80, align: "right" });
      doc.text(`Bs ${Number(item.subtotal).toFixed(2)}`, col5, yPos, { width: 80, align: "right" });
      yPos += 18;
    }

    doc.y = yPos + 5;
    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    const totalsX = rightX - 160;
    doc.fontSize(10);

    doc.font("Helvetica");
    doc.text("Subtotal:", totalsX, doc.y, { width: 80, align: "left" });
    doc.text(`Bs ${Number(venta.factura_subtotal).toFixed(2)}`, totalsX + 80, doc.y - 12, { width: 80, align: "right" });

    doc.moveDown(0.3);
    doc.text("IVA (13%):", totalsX, doc.y, { width: 80, align: "left" });
    doc.text(`Bs ${Number(venta.impuesto).toFixed(2)}`, totalsX + 80, doc.y - 12, { width: 80, align: "right" });

    doc.moveDown(0.5);
    doc.moveTo(totalsX, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.3);

    doc.font("Helvetica-Bold");
    doc.text("TOTAL:", totalsX, doc.y, { width: 80, align: "left" });
    doc.text(`Bs ${Number(venta.factura_total).toFixed(2)}`, totalsX + 80, doc.y - 12, { width: 80, align: "right" });

    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(8).font("Helvetica").text(
      "Esta factura es generada electrónicamente y es válida para efectos fiscales.",
      { align: "center" },
    );

    doc.end();
  });
};
