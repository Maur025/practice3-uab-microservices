import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllPayments, registerSupplierPayment } from "../services/payment.service.js";

export const getPayments = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllPayments({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const createSupplierPayment = asyncHandler(async (req, res) => {
  const result = await registerSupplierPayment(req.body);
  successResponse(res, result, 201, "Pago a proveedor registrado exitosamente");
});
