import sucursalService from '../services/sucursal.service.js';
import { asyncHandler, successResponse } from '../utils/response.js';

class SucursalController {
  getAll = asyncHandler(async (req, res) => {
    const sucursales = await sucursalService.getAll();
    successResponse(res, sucursales);
  });

  getById = asyncHandler(async (req, res) => {
    const sucursal = await sucursalService.getById(req.params.id);
    successResponse(res, sucursal);
  });

  create = asyncHandler(async (req, res) => {
    const sucursal = await sucursalService.create(req.body);
    successResponse(res, sucursal, 201, 'Sucursal creada');
  });

  update = asyncHandler(async (req, res) => {
    const sucursal = await sucursalService.update(req.params.id, req.body);
    successResponse(res, sucursal, 200, 'Sucursal actualizada');
  });

  remove = asyncHandler(async (req, res) => {
    const sucursal = await sucursalService.remove(req.params.id);
    successResponse(res, sucursal, 200, 'Sucursal desactivada');
  });
}

export default new SucursalController();
