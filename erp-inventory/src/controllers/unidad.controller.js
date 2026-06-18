import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllUnidades,
  findUnidadById,
  createUnidad,
  updateUnidad,
  deleteUnidad,
} from "../services/unidad.service.js";

export const getUnidades = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllUnidades({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getUnidad = asyncHandler(async (req, res) => {
  const data = await findUnidadById(Number(req.params.id));
  successResponse(res, data);
});

export const postUnidad = asyncHandler(async (req, res) => {
  const data = await createUnidad(req.body);
  successResponse(res, data, 201, "Unidad creada");
});

export const putUnidad = asyncHandler(async (req, res) => {
  const data = await updateUnidad(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Unidad actualizada");
});

export const removeUnidad = asyncHandler(async (req, res) => {
  await deleteUnidad(Number(req.params.id));
  successResponse(res, null, 200, "Unidad eliminada");
});
