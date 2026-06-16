import { Sucursal } from '../models/index.js';

class SucursalRepository {
  async findAll() {
    return Sucursal.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id) {
    return Sucursal.findByPk(id);
  }

  async create(data) {
    return Sucursal.create(data);
  }

  async update(id, data) {
    const sucursal = await this.findById(id);
    if (!sucursal) return null;
    return sucursal.update(data);
  }

  async remove(id) {
    const sucursal = await this.findById(id);
    if (!sucursal) return null;
    await sucursal.update({ activo: false });
    return sucursal;
  }
}

export default new SucursalRepository();
