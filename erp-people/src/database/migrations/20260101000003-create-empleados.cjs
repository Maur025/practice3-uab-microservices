'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('empleados', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sucursal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sucursales', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      cargo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cargos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nombres: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellido_paterno: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      apellido_materno: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      numero_documento: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      correo_electronico: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      fecha_ingreso: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('empleados');
  },
};
