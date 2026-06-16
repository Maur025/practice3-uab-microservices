import cargoService from '../services/cargo.service.js';
import { asyncHandler, successResponse } from '../utils/response.js';

class CargoController {
  getAll = asyncHandler(async (req, res) => {
    const cargos = await cargoService.getAll();
    successResponse(res, cargos);
  });

  getById = asyncHandler(async (req, res) => {
    const cargo = await cargoService.getById(req.params.id);
    successResponse(res, cargo);
  });

  create = asyncHandler(async (req, res) => {
    const cargo = await cargoService.create(req.body);
    successResponse(res, cargo, 201, 'Cargo creado');
  });

  update = asyncHandler(async (req, res) => {
    const cargo = await cargoService.update(req.params.id, req.body);
    successResponse(res, cargo, 200, 'Cargo actualizado');
  });

  remove = asyncHandler(async (req, res) => {
    const cargo = await cargoService.remove(req.params.id);
    successResponse(res, cargo, 200, 'Cargo desactivado');
  });
}

export default new CargoController();
