'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const fechaIngreso = '2024-01-01';

    await queryInterface.bulkInsert('sucursales', [
      {
        nombre: 'Casa Matriz',
        direccion: 'Av. Principal 100',
        ciudad: 'Lima',
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('cargos', [
      {
        nombre: 'Administrador del Sistema',
        descripcion: 'Responsable de la administración del ERP',
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('empleados', [
      {
        sucursal_id: 1,
        cargo_id: 1,
        nombres: 'Administrador',
        apellido_paterno: 'General',
        apellido_materno: null,
        numero_documento: '00000001',
        telefono: '999999999',
        correo_electronico: 'admin@erp.com',
        fecha_ingreso: fechaIngreso,
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    const passwordHash = await bcrypt.hash('Admin123*', 12);

    await queryInterface.bulkInsert('usuarios', [
      {
        empleado_id: 1,
        nombre_usuario: 'admin',
        correo_electronico: 'admin@erp.com',
        password_hash: passwordHash,
        refresh_token_hash: null,
        ultimo_acceso: null,
        activo: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('usuario_roles', [
      {
        usuario_id: 1,
        rol_id: 1,
        created_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuario_roles', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('empleados', null, {});
    await queryInterface.bulkDelete('cargos', null, {});
    await queryInterface.bulkDelete('sucursales', null, {});
  },
};
