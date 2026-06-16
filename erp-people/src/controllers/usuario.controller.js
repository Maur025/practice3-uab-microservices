import usuarioService from "../services/usuario.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";

class UsuarioController {
  getAll = asyncHandler(async (req, res) => {
    const usuarios = await usuarioService.getAll();
    successResponse(res, usuarios);
  });

  getById = asyncHandler(async (req, res) => {
    const usuario = await usuarioService.getById(req.params.id);
    successResponse(res, usuario);
  });

  create = asyncHandler(async (req, res) => {
    const usuario = await usuarioService.create(req.body);
    successResponse(res, usuario, 201, "Usuario creado");
  });

  update = asyncHandler(async (req, res) => {
    const usuario = await usuarioService.update(req.params.id, req.body);
    successResponse(res, usuario, 200, "Usuario actualizado");
  });

  remove = asyncHandler(async (req, res) => {
    const usuario = await usuarioService.remove(req.params.id);
    successResponse(res, usuario, 200, "Usuario desactivado");
  });
}

export default new UsuarioController();
