import { Rol } from '../models/index.js';

class RolRepository {
  async findAll() {
    return Rol.findAll({ order: [['id', 'ASC']] });
  }

  async findById(id) {
    return Rol.findByPk(id);
  }

  async findByCodigo(codigo) {
    return Rol.findOne({ where: { codigo } });
  }

  async create(data) {
    return Rol.create(data);
  }

  async update(id, data) {
    const rol = await this.findById(id);
    if (!rol) return null;
    return rol.update(data);
  }

  async remove(id) {
    const rol = await this.findById(id);
    if (!rol) return null;
    await rol.update({ activo: false });
    return rol;
  }
}

export default new RolRepository();
