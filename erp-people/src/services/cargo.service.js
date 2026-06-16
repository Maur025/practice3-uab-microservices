import cargoRepository from '../repositories/cargo.repository.js';
import { AppError } from '../utils/response.js';

class CargoService {
  async getAll() {
    return cargoRepository.findAll();
  }

  async getById(id) {
    const cargo = await cargoRepository.findById(id);
    if (!cargo) {
      throw new AppError('Cargo no encontrado', 404);
    }
    return cargo;
  }

  async create(data) {
    if (!data.nombre) {
      throw new AppError('El nombre es requerido', 400);
    }
    return cargoRepository.create({
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      activo: data.activo !== undefined ? data.activo : true,
    });
  }

  async update(id, data) {
    await this.getById(id);
    const payload = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion;
    if (data.activo !== undefined) payload.activo = data.activo;
    return cargoRepository.update(id, payload);
  }

  async remove(id) {
    const cargo = await cargoRepository.remove(id);
    if (!cargo) {
      throw new AppError('Cargo no encontrado', 404);
    }
    return cargo;
  }
}

export default new CargoService();
