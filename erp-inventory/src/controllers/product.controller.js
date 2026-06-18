import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const id_categoria = req.query.id_categoria ? Number(req.query.id_categoria) : undefined;
  const id_sucursal = req.query.id_sucursal ? Number(req.query.id_sucursal) : undefined;
  const { rows, count } = await findAllProducts({ limit, offset, id_categoria, id_sucursal });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getProduct = asyncHandler(async (req, res) => {
  const data = await findProductById(Number(req.params.id));
  successResponse(res, data);
});

export const postProduct = asyncHandler(async (req, res) => {
  const data = await createProduct(req.body);
  successResponse(res, data, 201, "Producto creado");
});

export const putProduct = asyncHandler(async (req, res) => {
  const data = await updateProduct(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Producto actualizado");
});

export const removeProduct = asyncHandler(async (req, res) => {
  await deleteProduct(Number(req.params.id));
  successResponse(res, null, 200, "Producto desactivado");
});
