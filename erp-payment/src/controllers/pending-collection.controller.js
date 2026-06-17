import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllPendingCollections, registerPendingCollection } from "../services/pending-collection.service.js";

export const getPendingCollections = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllPendingCollections({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const createPendingCollection = asyncHandler(async (req, res) => {
  const result = await registerPendingCollection(req.body);
  successResponse(res, result, 201, "Cuenta por cobrar registrada exitosamente");
});