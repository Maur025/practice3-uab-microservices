import {
  createProvider as createProviderService,
  deleteProvider as deleteProviderService,
  findAllProviders,
  findProviderById,
  updateProvider as updateProviderService,
} from "../services/provider.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";

export const getProviders = asyncHandler(async (req, res) => {
  const providers = await findAllProviders();
  successResponse(res, providers);
});

export const getProviderById = asyncHandler(async (req, res) => {
  const provider = await findProviderById(req.params.id);
  successResponse(res, provider);
});

export const createProvider = asyncHandler(async (req, res) => {
  const provider = await createProviderService(req.body);
  successResponse(res, provider, 201, "Proveedor creado");
});

export const updateProvider = asyncHandler(async (req, res) => {
  const provider = await updateProviderService(req.params.id, req.body);
  successResponse(res, provider, 200, "Proveedor actualizado");
});

export const deleteProvider = asyncHandler(async (req, res) => {
  const provider = await deleteProviderService(req.params.id);
  successResponse(res, provider, 200, "Proveedor desactivado");
});
