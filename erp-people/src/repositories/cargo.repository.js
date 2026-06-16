import { Cargo } from '../models/index.js';

class CargoRepository {
  async findAll() {
    return Cargo.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id) {
    return Cargo.findByPk(id);
  }

  async create(data) {
    return Cargo.create(data);
  }

  async update(id, data) {
    const cargo = await this.findById(id);
    if (!cargo) return null;
    return cargo.update(data);
  }

  async remove(id) {
    const cargo = await this.findById(id);
    if (!cargo) return null;
    await cargo.update({ activo: false });
    return cargo;
  }
}

export default new CargoRepository();
