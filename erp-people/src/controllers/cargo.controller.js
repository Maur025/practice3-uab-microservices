import cargoService from "../services/cargo.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

class CargoController {
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const { rows, count } = await cargoService.getAll({ limit, offset });
    const pagination = getPaginationMeta(count, page, limit);
    successResponse(res, rows, 200, "OK", pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const cargo = await cargoService.getById(req.params.id);
    successResponse(res, cargo);
  });

  create = asyncHandler(async (req, res) => {
    const cargo = await cargoService.create(req.body);
    successResponse(res, cargo, 201, "Cargo creado");
  });

  update = asyncHandler(async (req, res) => {
    const cargo = await cargoService.update(req.params.id, req.body);
    successResponse(res, cargo, 200, "Cargo actualizado");
  });

  remove = asyncHandler(async (req, res) => {
    const cargo = await cargoService.remove(req.params.id);
    successResponse(res, cargo, 200, "Cargo desactivado");
  });
}

export default new CargoController();
