import {
  createClient as createClientService,
  deleteClient as deleteClientService,
  findAllClients,
  findClientById,
  updateClient as updateClientService,
} from "../services/client.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export const getClients = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await findAllClients({ limit, offset });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getClientById = asyncHandler(async (req, res) => {
  const client = await findClientById(req.params.id);
  successResponse(res, client);
});

export const createClient = asyncHandler(async (req, res) => {
  const client = await createClientService(req.body);
  successResponse(res, client, 201, "Cliente creado");
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await updateClientService(req.params.id, req.body);
  successResponse(res, client, 200, "Cliente actualizado");
});

export const deleteClient = asyncHandler(async (req, res) => {
  const client = await deleteClientService(req.params.id);
  successResponse(res, client, 200, "Cliente desactivado");
});
