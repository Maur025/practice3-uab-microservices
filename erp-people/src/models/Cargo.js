import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Cargo = sequelize.define(
  'Cargo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'cargos',
    underscored: true,
  },
);

export default Cargo;
