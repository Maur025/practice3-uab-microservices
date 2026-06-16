import authService from '../services/auth.service.js';
import { asyncHandler, successResponse } from '../utils/response.js';

class AuthController {
  login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);
    successResponse(res, result, 200, 'Inicio de sesión exitoso');
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    successResponse(res, result, 200, 'Token renovado');
  });

  logout = asyncHandler(async (req, res) => {
    const result = await authService.logout(req.user.id);
    successResponse(res, result, 200, 'Sesión cerrada');
  });

  me = asyncHandler(async (req, res) => {
    const usuario = await authService.me(req.user.id);
    successResponse(res, usuario, 200, 'Perfil obtenido');
  });
}

export default new AuthController();
