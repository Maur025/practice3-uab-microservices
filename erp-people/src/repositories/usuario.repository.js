import { Usuario, Empleado, Rol } from '../models/index.js';

const usuarioInclude = [
  {
    model: Empleado,
    as: 'empleado',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno', 'correo_electronico'],
  },
  {
    model: Rol,
    as: 'roles',
    attributes: ['id', 'nombre', 'codigo'],
    through: { attributes: [] },
  },
];

class UsuarioRepository {
  async findAll() {
    return Usuario.findAll({
      include: usuarioInclude,
      order: [['id', 'ASC']],
    });
  }

  async findById(id) {
    return Usuario.findByPk(id, { include: usuarioInclude });
  }

  async findByUsernameOrEmail(identifier) {
    const { Op } = await import('sequelize');
    return Usuario.scope('withSecrets').findOne({
      where: {
        activo: true,
        [Op.or]: [
          { nombre_usuario: identifier },
          { correo_electronico: identifier },
        ],
      },
      include: usuarioInclude,
    });
  }

  async findByIdWithSecrets(id) {
    return Usuario.scope('withSecrets').findByPk(id, { include: usuarioInclude });
  }

  async create(data, rolIds = []) {
    const usuario = await Usuario.create(data);
    if (rolIds.length > 0) {
      await usuario.setRoles(rolIds);
    }
    return this.findById(usuario.id);
  }

  async update(id, data, rolIds = null) {
    const usuario = await Usuario.scope('withSecrets').findByPk(id);
    if (!usuario) return null;

    await usuario.update(data);

    if (rolIds !== null) {
      await usuario.setRoles(rolIds);
    }

    return this.findById(id);
  }

  async remove(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.update({ activo: false });
    return this.findById(id);
  }

  async updateRefreshToken(id, refreshTokenHash) {
    const usuario = await Usuario.scope('withSecrets').findByPk(id);
    if (!usuario) return null;
    usuario.refresh_token_hash = refreshTokenHash;
    await usuario.save();
    return usuario;
  }

  async clearRefreshToken(id) {
    const usuario = await Usuario.scope('withSecrets').findByPk(id);
    if (!usuario) return null;
    usuario.refresh_token_hash = null;
    await usuario.save();
    return usuario;
  }

  async updateUltimoAcceso(id) {
    const usuario = await Usuario.scope('withSecrets').findByPk(id);
    if (!usuario) return null;
    usuario.ultimo_acceso = new Date();
    await usuario.save();
    return usuario;
  }
}

export default new UsuarioRepository();
