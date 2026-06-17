import { asyncHandler, successResponse, AppError } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllSales, registerSale, findSaleById, annulSale } from "../services/sale.service.js";

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
  const { estado } = req.body;

  if (estado !== 'ANULADA') {
    throw new AppError("Solo se permite la actualización al estado ANULADA", 400);
  }

  const result = await annulSale(id);
  successResponse(res, result, 200, "Venta anulada correctamente");
});