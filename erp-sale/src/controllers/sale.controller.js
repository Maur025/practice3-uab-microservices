import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllSales, registerSale, findSaleById, annulSale } from "../services/sale.service.js";
import { generateInvoicePdf } from "../services/pdf.service.js";
import { getRevenueReport, generateReportPdf } from "../services/report.service.js";
import { getCustomerStats, getTopCustomers } from "../services/customer.service.js";

export const getSales = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllSales({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const createSale = asyncHandler(async (req, res) => {
  const result = await registerSale(req.body);
  successResponse(res, result, 201, "Venta y factura registradas correctamente");
});

export const getSale = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sale = await findSaleById(id);
  successResponse(res, sale);
});

export const updateSaleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await annulSale(id);
  successResponse(res, result, 200, "Venta anulada correctamente");
});

export const getInvoicePdf = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pdfBuffer = await generateInvoicePdf(id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="factura-${id}.pdf"`);
  res.send(pdfBuffer);
});

export const getRevenue = asyncHandler(async (req, res) => {
  const data = await getRevenueReport(req.query);
  successResponse(res, data, 200, "Reporte de ingresos generado");
});

export const getRevenuePdf = asyncHandler(async (req, res) => {
  const pdfBuffer = await generateReportPdf(req.query);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="reporte-ingresos.pdf"');
  res.send(pdfBuffer);
});

export const getCustomerFidelity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { id_sucursal } = req.query;
  const stats = await getCustomerStats(id, { id_sucursal: id_sucursal ? Number(id_sucursal) : undefined });
  successResponse(res, stats, 200, "Estadísticas de fidelización generadas");
});

export const getTopCustomersList = asyncHandler(async (req, res) => {
  const { id_sucursal, limit } = req.query;
  const top = await getTopCustomers({
    id_sucursal: id_sucursal ? Number(id_sucursal) : undefined,
    limit: limit ? Number(limit) : 10,
  });
  successResponse(res, top, 200, "Top clientes generado");
});
