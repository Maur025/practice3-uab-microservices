import empleadoService from "../services/empleado.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

class EmpleadoController {
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const { rows, count } = await empleadoService.getAll({ limit, offset });
    const pagination = getPaginationMeta(count, page, limit);
    successResponse(res, rows, 200, "OK", pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const empleado = await empleadoService.getById(req.params.id);
    successResponse(res, empleado);
  });

  create = asyncHandler(async (req, res) => {
    const empleado = await empleadoService.create(req.body);
    successResponse(res, empleado, 201, "Empleado creado");
  });

  update = asyncHandler(async (req, res) => {
    const empleado = await empleadoService.update(req.params.id, req.body);
    successResponse(res, empleado, 200, "Empleado actualizado");
  });

  remove = asyncHandler(async (req, res) => {
    const empleado = await empleadoService.remove(req.params.id);
    successResponse(res, empleado, 200, "Empleado desactivado");
  });
}

export default new EmpleadoController();
