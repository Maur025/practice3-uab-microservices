import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllCategorias,
  findCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../services/categoria.service.js";

export const getCategorias = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllCategorias({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getCategoria = asyncHandler(async (req, res) => {
  const data = await findCategoriaById(Number(req.params.id));
  successResponse(res, data);
});

export const postCategoria = asyncHandler(async (req, res) => {
  const data = await createCategoria(req.body);
  successResponse(res, data, 201, "Categoría creada");
});

export const putCategoria = asyncHandler(async (req, res) => {
  const data = await updateCategoria(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Categoría actualizada");
});

export const removeCategoria = asyncHandler(async (req, res) => {
  await deleteCategoria(Number(req.params.id));
  successResponse(res, null, 200, "Categoría eliminada");
});
