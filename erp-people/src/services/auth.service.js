import usuarioRepository from '../repositories/usuario.repository.js';
import { AppError } from '../utils/response.js';
import { comparePassword, hashToken } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

class AuthService {
  buildTokenPayload(usuario) {
    return {
      sub: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      correo_electronico: usuario.correo_electronico,
      roles: usuario.roles?.map((r) => r.codigo) || [],
    };
  }

  async login(identifier, password) {
    const usuario = await usuarioRepository.findByUsernameOrEmail(identifier);

    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValid = await comparePassword(password, usuario.password_hash);
    if (!isValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const payload = this.buildTokenPayload(usuario);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ sub: usuario.id });

    const refreshTokenHash = await hashToken(refreshToken);
    await usuarioRepository.updateRefreshToken(usuario.id, refreshTokenHash);
    await usuarioRepository.updateUltimoAcceso(usuario.id);

    const usuarioData = await usuarioRepository.findById(usuario.id);

    return {
      accessToken,
      refreshToken,
      usuario: usuarioData,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token requerido', 400);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Refresh token inválido o expirado', 401);
    }

    const usuario = await usuarioRepository.findByIdWithSecrets(decoded.sub);
    if (!usuario || !usuario.activo) {
      throw new AppError('Usuario no encontrado', 401);
    }

    const { compareToken } = await import('../utils/password.js');
    const isValid = await compareToken(refreshToken, usuario.refresh_token_hash);
    if (!isValid) {
      throw new AppError('Refresh token inválido', 401);
    }

    const payload = this.buildTokenPayload(usuario);
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ sub: usuario.id });
    const newRefreshTokenHash = await hashToken(newRefreshToken);

    await usuarioRepository.updateRefreshToken(usuario.id, newRefreshTokenHash);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId) {
    await usuarioRepository.clearRefreshToken(userId);
    return { message: 'Sesión cerrada correctamente' };
  }

  async me(userId) {
    const usuario = await usuarioRepository.findById(userId);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return usuario;
  }
}

export default new AuthService();
