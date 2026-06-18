import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllInventarios,
  findInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  inicializarStock,
  transferirStock,
  reporteStockPorEmpresa,
} from "../services/inventory.service.js";
import { generateStockReportPdf } from "../services/stock-report-pdf.service.js";

export const getInventarios = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const id_sucursal = req.query.id_sucursal ? Number(req.query.id_sucursal) : undefined;
  const id_producto = req.query.id_producto ? Number(req.query.id_producto) : undefined;
  const { rows, count } = await findAllInventarios({ limit, offset, id_sucursal, id_producto });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getInventario = asyncHandler(async (req, res) => {
  const data = await findInventarioById(Number(req.params.id));
  successResponse(res, data);
});

export const postInventario = asyncHandler(async (req, res) => {
  const data = await createInventario(req.body);
  successResponse(res, data, 201, "Registro de inventario creado");
});

export const putInventario = asyncHandler(async (req, res) => {
  const data = await updateInventario(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Inventario actualizado");
});

export const removeInventario = asyncHandler(async (req, res) => {
  await deleteInventario(Number(req.params.id));
  successResponse(res, null, 200, "Registro de inventario eliminado");
});

export const postInicializarStock = asyncHandler(async (req, res) => {
  const { id_sucursal, productos, observacion } = req.body;
  const data = await inicializarStock(id_sucursal, productos, observacion);
  successResponse(res, { movimientos_generados: data }, 201, "Stock inicializado correctamente");
});

export const postTransferirStock = asyncHandler(async (req, res) => {
  const { id_sucursal_origen, id_sucursal_destino, productos } = req.body;
  const data = await transferirStock(id_sucursal_origen, id_sucursal_destino, productos);
  successResponse(res, { movimientos_generados: data }, 200, "Transferencia realizada correctamente");
});

export const getReporteStock = asyncHandler(async (req, res) => {
  const id_empresa = req.query.id_empresa ? Number(req.query.id_empresa) : undefined;
  const id_producto = req.query.id_producto ? Number(req.query.id_producto) : undefined;
  const rows = await reporteStockPorEmpresa(id_empresa, id_producto);
  successResponse(res, rows, 200, "OK");
});

export const getReporteStockPdf = asyncHandler(async (req, res) => {
  const id_empresa = req.query.id_empresa ? Number(req.query.id_empresa) : undefined;
  const id_producto = req.query.id_producto ? Number(req.query.id_producto) : undefined;
  const pdfBuffer = await generateStockReportPdf(id_empresa, id_producto);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="reporte-stock.pdf"');
  res.send(pdfBuffer);
});
