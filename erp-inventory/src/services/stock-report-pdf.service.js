import PDFDocument from "pdfkit";
import { reporteStockPorEmpresa } from "./inventory.service.js";

export const generateStockReportPdf = async (id_empresa, id_producto) => {
  const data = await reporteStockPorEmpresa(id_empresa, id_producto);

  const doc = new PDFDocument({ margin: 40, size: "LETTER" });
  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const rightX = doc.page.width - 40;

    doc.fontSize(16).font("Helvetica-Bold").text("REPORTE DE STOCK POR EMPRESA", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica");

    if (data.length > 0 && data[0].empresa_nombre) {
      doc.text(`Empresa: ${data[0].empresa_nombre}`, { align: "center" });
    }
    doc.moveDown(0.5);

    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);

    const grouped = {};
    let totalGeneral = 0;

    for (const row of data) {
      const key = `${row.empresa_nombre}||${row.id_empresa}`;
      if (!grouped[key]) {
        grouped[key] = { empresa: row.empresa_nombre, sucursales: [], total: 0 };
      }
      grouped[key].sucursales.push(row);
      grouped[key].total += Number(row.stock_actual);
      totalGeneral += Number(row.stock_actual);
    }

    const valueX = 350;

    for (const g of Object.values(grouped)) {
      if (doc.y > doc.page.height - 120) {
        doc.addPage();
      }

      doc.fontSize(12).font("Helvetica-Bold").text(g.empresa);
      doc.moveDown(0.2);

      for (const row of g.sucursales) {
        doc.fontSize(10).font("Helvetica");
        const line = `${row.sucursal_nombre}  ->  ${row.producto_nombre} (${row.producto_codigo || "S/N"})  ->  ${Number(row.stock_actual)} ${row.unidad_abreviatura || "u"}`;
        doc.text(line, { indent: 10 });
      }

      doc.font("Helvetica-Bold").fontSize(10);
      doc.text(`Total ${g.empresa}: ${g.total} unidades`, valueX, doc.y - 12, { width: 200, align: "right" });
      doc.moveDown(0.8);
    }

    doc.moveTo(40, doc.y).lineTo(rightX, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica-Bold");
    doc.text(`TOTAL GENERAL: ${totalGeneral} unidades`, { align: "right" });

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
