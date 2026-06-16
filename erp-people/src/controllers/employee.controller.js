import empleadoService from "../services/empleado.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";

class EmpleadoController {
  getAll = asyncHandler(async (req, res) => {
    const empleados = await empleadoService.getAll();
    successResponse(res, empleados);
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
