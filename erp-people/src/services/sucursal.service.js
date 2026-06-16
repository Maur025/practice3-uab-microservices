import sucursalRepository from '../repositories/sucursal.repository.js';
import { AppError } from '../utils/response.js';

class SucursalService {
  async getAll() {
    return sucursalRepository.findAll();
  }

  async getById(id) {
    const sucursal = await sucursalRepository.findById(id);
    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }
    return sucursal;
  }

  async create(data) {
    if (!data.nombre) {
      throw new AppError('El nombre es requerido', 400);
    }
    return sucursalRepository.create({
      nombre: data.nombre,
      direccion: data.direccion || null,
      ciudad: data.ciudad || null,
      activo: data.activo !== undefined ? data.activo : true,
    });
  }

  async update(id, data) {
    await this.getById(id);
    const payload = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.direccion !== undefined) payload.direccion = data.direccion;
    if (data.ciudad !== undefined) payload.ciudad = data.ciudad;
    if (data.activo !== undefined) payload.activo = data.activo;
    return sucursalRepository.update(id, payload);
  }

  async remove(id) {
    const sucursal = await sucursalRepository.remove(id);
    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }
    return sucursal;
  }
}

export default new SucursalService();
