import rolService from '../services/rol.service.js';
import { asyncHandler, successResponse } from '../utils/response.js';

class RolController {
  getAll = asyncHandler(async (req, res) => {
    const roles = await rolService.getAll();
    successResponse(res, roles);
  });

  getById = asyncHandler(async (req, res) => {
    const rol = await rolService.getById(req.params.id);
    successResponse(res, rol);
  });

  create = asyncHandler(async (req, res) => {
    const rol = await rolService.create(req.body);
    successResponse(res, rol, 201, 'Rol creado');
  });

  update = asyncHandler(async (req, res) => {
    const rol = await rolService.update(req.params.id, req.body);
    successResponse(res, rol, 200, 'Rol actualizado');
  });

  remove = asyncHandler(async (req, res) => {
    const rol = await rolService.remove(req.params.id);
    successResponse(res, rol, 200, 'Rol desactivado');
  });
}

export default new RolController();
