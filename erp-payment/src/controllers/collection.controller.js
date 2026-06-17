import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import { findAllCollections, registerCollection } from "../services/collection.service.js";

export const getCollections = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllCollections({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const createCollection = asyncHandler(async (req, res) => {
  const result = await registerCollection(req.body);
  successResponse(res, result, 201, "Pago registrado exitosamente");
});