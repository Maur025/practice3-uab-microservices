import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllPendingPayments,
  findPendingPaymentById,
  registerPendingPayment,
} from "../services/pending-payment.service.js";

export const getPendingPayments = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllPendingPayments({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getPendingPayment = asyncHandler(async (req, res) => {
  const data = await findPendingPaymentById(Number(req.params.id));
  successResponse(res, data);
});

export const createPendingPayment = asyncHandler(async (req, res) => {
  const result = await registerPendingPayment(req.body);
  successResponse(res, result, 201, "Cuenta por pagar registrada exitosamente");
});
