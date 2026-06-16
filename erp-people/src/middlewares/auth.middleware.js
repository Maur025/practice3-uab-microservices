import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/response.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de acceso requerido', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.sub,
      nombre_usuario: decoded.nombre_usuario,
      correo_electronico: decoded.correo_electronico,
      roles: decoded.roles || [],
    };
    next();
  } catch {
    next(new AppError('Token inválido o expirado', 401));
  }
};

export const rolesMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('No autenticado', 401));
  }

  const userRoles = req.user.roles || [];
  const hasRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    return next(new AppError('No tiene permisos para esta operación', 403));
  }

  next();
};
