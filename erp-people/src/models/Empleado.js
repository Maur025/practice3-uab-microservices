import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Empleado = sequelize.define(
  'Empleado',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sucursal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cargo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido_paterno: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido_materno: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    numero_documento: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    correo_electronico: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'empleados',
    underscored: true,
  },
);

export default Empleado;
