import {
  createClient as createClientService,
  deleteClient as deleteClientService,
  findAllClients,
  findClientById,
  updateClient as updateClientService,
} from "../services/client.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";

export const getClients = asyncHandler(async (req, res) => {
  const clients = await findAllClients();
  successResponse(res, clients);
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
