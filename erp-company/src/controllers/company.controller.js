import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllEmpresas,
  findEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  findAllSucursales,
  findSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "../services/company.service.js";

export const getEmpresas = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllEmpresas({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getEmpresa = asyncHandler(async (req, res) => {
  const data = await findEmpresaById(Number(req.params.id));
  successResponse(res, data);
});

export const postEmpresa = asyncHandler(async (req, res) => {
  const data = await createEmpresa(req.body);
  successResponse(res, data, 201, "Empresa creada");
});

export const putEmpresa = asyncHandler(async (req, res) => {
  const data = await updateEmpresa(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Empresa actualizada");
});

export const removeEmpresa = asyncHandler(async (req, res) => {
  await deleteEmpresa(Number(req.params.id));
  successResponse(res, null, 200, "Empresa desactivada");
});

export const getSucursales = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const id_empresa = req.query.id_empresa ? Number(req.query.id_empresa) : undefined;
  const { rows, count } = await findAllSucursales({ limit, offset, id_empresa });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getSucursal = asyncHandler(async (req, res) => {
  const data = await findSucursalById(Number(req.params.id));
  successResponse(res, data);
});

export const postSucursal = asyncHandler(async (req, res) => {
  const data = await createSucursal(req.body);
  successResponse(res, data, 201, "Sucursal creada");
});

export const putSucursal = asyncHandler(async (req, res) => {
  const data = await updateSucursal(Number(req.params.id), req.body);
  successResponse(res, data, 200, "Sucursal actualizada");
});

export const removeSucursal = asyncHandler(async (req, res) => {
  await deleteSucursal(Number(req.params.id));
  successResponse(res, null, 200, "Sucursal desactivada");
});
