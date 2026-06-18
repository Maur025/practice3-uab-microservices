import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllPurchases,
  findPurchaseById,
  createPurchase,
  annulPurchase,
} from "../services/purchase.service.js";

export const getPurchases = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const id_proveedor = req.query.id_proveedor ? Number(req.query.id_proveedor) : undefined;
  const id_sucursal = req.query.id_sucursal ? Number(req.query.id_sucursal) : undefined;
  const fecha_desde = req.query.fecha_desde || undefined;
  const fecha_hasta = req.query.fecha_hasta || undefined;
  const { rows, count } = await findAllPurchases({ limit, offset, id_proveedor, id_sucursal, fecha_desde, fecha_hasta });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getPurchase = asyncHandler(async (req, res) => {
  const data = await findPurchaseById(Number(req.params.id));
  successResponse(res, data);
});

export const postPurchase = asyncHandler(async (req, res) => {
  const data = await createPurchase(req.body);
  successResponse(res, data, 201, "Compra registrada correctamente");
});

export const putPurchaseStatus = asyncHandler(async (req, res) => {
  const data = await annulPurchase(Number(req.params.id));
  successResponse(res, data, 200, "Compra anulada correctamente");
});
