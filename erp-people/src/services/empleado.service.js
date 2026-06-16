import empleadoRepository from '../repositories/empleado.repository.js';
import sucursalRepository from '../repositories/sucursal.repository.js';
import cargoRepository from '../repositories/cargo.repository.js';
import { AppError } from '../utils/response.js';

class EmpleadoService {
  async getAll() {
    return empleadoRepository.findAll();
  }

  async getById(id) {
    const empleado = await empleadoRepository.findById(id);
    if (!empleado) {
      throw new AppError('Empleado no encontrado', 404);
    }
    return empleado;
  }

  async create(data) {
    const required = ['sucursal_id', 'cargo_id', 'nombres', 'apellido_paterno', 'numero_documento', 'fecha_ingreso'];
    for (const field of required) {
      if (!data[field]) {
        throw new AppError(`El campo ${field} es requerido`, 400);
      }
    }

    const sucursal = await sucursalRepository.findById(data.sucursal_id);
    if (!sucursal) {
      throw new AppError('Sucursal no encontrada', 404);
    }

    const cargo = await cargoRepository.findById(data.cargo_id);
    if (!cargo) {
      throw new AppError('Cargo no encontrado', 404);
    }

    return empleadoRepository.create({
      sucursal_id: data.sucursal_id,
      cargo_id: data.cargo_id,
      nombres: data.nombres,
      apellido_paterno: data.apellido_paterno,
      apellido_materno: data.apellido_materno || null,
      numero_documento: data.numero_documento,
      telefono: data.telefono || null,
      correo_electronico: data.correo_electronico || null,
      fecha_ingreso: data.fecha_ingreso,
      activo: data.activo !== undefined ? data.activo : true,
    });
  }

  async update(id, data) {
    await this.getById(id);
    const payload = {};

    if (data.sucursal_id !== undefined) {
      const sucursal = await sucursalRepository.findById(data.sucursal_id);
      if (!sucursal) {
        throw new AppError('Sucursal no encontrada', 404);
      }
      payload.sucursal_id = data.sucursal_id;
    }

    if (data.cargo_id !== undefined) {
      const cargo = await cargoRepository.findById(data.cargo_id);
      if (!cargo) {
        throw new AppError('Cargo no encontrado', 404);
      }
      payload.cargo_id = data.cargo_id;
    }

    const fields = [
      'nombres', 'apellido_paterno', 'apellido_materno',
      'numero_documento', 'telefono', 'correo_electronico',
      'fecha_ingreso', 'activo',
    ];
    for (const field of fields) {
      if (data[field] !== undefined) {
        payload[field] = data[field];
      }
    }

    return empleadoRepository.update(id, payload);
  }

  async remove(id) {
    const empleado = await empleadoRepository.remove(id);
    if (!empleado) {
      throw new AppError('Empleado no encontrado', 404);
    }
    return empleado;
  }
}

export default new EmpleadoService();
