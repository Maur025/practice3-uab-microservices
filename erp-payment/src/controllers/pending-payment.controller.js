import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllPendingPayments } from "../services/pending-payment.service.js";

export const getPendingPayments = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllPendingPayments({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});
