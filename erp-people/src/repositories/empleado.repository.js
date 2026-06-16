import { Empleado, Sucursal, Cargo } from '../models/index.js';

class EmpleadoRepository {
  async findAll() {
    return Empleado.findAll({
      include: [
        { model: Sucursal, as: 'sucursal', attributes: ['id', 'nombre'] },
        { model: Cargo, as: 'cargo', attributes: ['id', 'nombre'] },
      ],
      order: [['id', 'ASC']],
    });
  }

  async findById(id) {
    return Empleado.findByPk(id, {
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: Cargo, as: 'cargo' },
      ],
    });
  }

  async create(data) {
    return Empleado.create(data);
  }

  async update(id, data) {
    const empleado = await this.findById(id);
    if (!empleado) return null;
    await empleado.update(data);
    return this.findById(id);
  }

  async remove(id) {
    const empleado = await this.findById(id);
    if (!empleado) return null;
    await empleado.update({ activo: false });
    return empleado;
  }
}

export default new EmpleadoRepository();
