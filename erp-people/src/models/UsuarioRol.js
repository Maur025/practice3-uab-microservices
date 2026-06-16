import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UsuarioRol = sequelize.define(
  'UsuarioRol',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'usuario_roles',
    underscored: true,
    updatedAt: false,
  },
);

export default UsuarioRol;
