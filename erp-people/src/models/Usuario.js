import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empleado_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    correo_electronico: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refresh_token_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'usuarios',
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password_hash', 'refresh_token_hash'] },
    },
    scopes: {
      withSecrets: {
        attributes: { include: ['password_hash', 'refresh_token_hash'] },
      },
    },
  },
);

export default Usuario;
