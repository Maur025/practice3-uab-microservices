import rolRepository from '../repositories/rol.repository.js';
import { AppError } from '../utils/response.js';

class RolService {
  async getAll() {
    return rolRepository.findAll();
  }

  async getById(id) {
    const rol = await rolRepository.findById(id);
    if (!rol) {
      throw new AppError('Rol no encontrado', 404);
    }
    return rol;
  }

  async create(data) {
    if (!data.nombre || !data.codigo) {
      throw new AppError('Los campos nombre y codigo son requeridos', 400);
    }
    return rolRepository.create({
      nombre: data.nombre,
      codigo: data.codigo.toUpperCase(),
      descripcion: data.descripcion || null,
      activo: data.activo !== undefined ? data.activo : true,
    });
  }

  async update(id, data) {
    await this.getById(id);
    const payload = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.codigo !== undefined) payload.codigo = data.codigo.toUpperCase();
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion;
    if (data.activo !== undefined) payload.activo = data.activo;
    return rolRepository.update(id, payload);
  }

  async remove(id) {
    const rol = await rolRepository.remove(id);
    if (!rol) {
      throw new AppError('Rol no encontrado', 404);
    }
    return rol;
  }
}

export default new RolService();
