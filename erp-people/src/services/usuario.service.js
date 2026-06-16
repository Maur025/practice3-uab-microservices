import usuarioRepository from '../repositories/usuario.repository.js';
import empleadoRepository from '../repositories/empleado.repository.js';
import rolRepository from '../repositories/rol.repository.js';
import { AppError } from '../utils/response.js';
import { hashPassword } from '../utils/password.js';

class UsuarioService {
  async getAll() {
    return usuarioRepository.findAll();
  }

  async getById(id) {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return usuario;
  }

  async create(data) {
    const required = ['empleado_id', 'nombre_usuario', 'correo_electronico', 'password'];
    for (const field of required) {
      if (!data[field]) {
        throw new AppError(`El campo ${field} es requerido`, 400);
      }
    }

    const empleado = await empleadoRepository.findById(data.empleado_id);
    if (!empleado) {
      throw new AppError('Empleado no encontrado', 404);
    }

    const passwordHash = await hashPassword(data.password);
    const rolIds = await this.resolveRolIds(data);

    return usuarioRepository.create(
      {
        empleado_id: data.empleado_id,
        nombre_usuario: data.nombre_usuario,
        correo_electronico: data.correo_electronico,
        password_hash: passwordHash,
        activo: data.activo !== undefined ? data.activo : true,
      },
      rolIds,
    );
  }

  async update(id, data) {
    await this.getById(id);
    const payload = {};

    if (data.empleado_id !== undefined) {
      const empleado = await empleadoRepository.findById(data.empleado_id);
      if (!empleado) {
        throw new AppError('Empleado no encontrado', 404);
      }
      payload.empleado_id = data.empleado_id;
    }

    if (data.nombre_usuario !== undefined) payload.nombre_usuario = data.nombre_usuario;
    if (data.correo_electronico !== undefined) payload.correo_electronico = data.correo_electronico;
    if (data.activo !== undefined) payload.activo = data.activo;

    if (data.password) {
      payload.password_hash = await hashPassword(data.password);
    }

    let rolIds = null;
    if (data.rol_ids !== undefined || data.rol_codigo !== undefined) {
      rolIds = await this.resolveRolIds(data);
    }

    return usuarioRepository.update(id, payload, rolIds);
  }

  async remove(id) {
    const usuario = await usuarioRepository.remove(id);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return usuario;
  }

  async resolveRolIds(data) {
    const rolIds = [];

    if (data.rol_ids && data.rol_ids.length > 0) {
      for (const rolId of data.rol_ids) {
        const rol = await rolRepository.findById(rolId);
        if (!rol) {
          throw new AppError(`Rol con id ${rolId} no encontrado`, 404);
        }
        rolIds.push(rolId);
      }
    }

    if (data.rol_codigo) {
      const rol = await rolRepository.findByCodigo(data.rol_codigo);
      if (!rol) {
        throw new AppError(`Rol ${data.rol_codigo} no encontrado`, 404);
      }
      rolIds.push(rol.id);
    }

    return [...new Set(rolIds)];
  }
}

export default new UsuarioService();
