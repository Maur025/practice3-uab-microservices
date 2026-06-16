'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      { nombre: 'Administrador', codigo: 'ADMINISTRADOR', descripcion: 'Acceso total al sistema', activo: true, created_at: now, updated_at: now },
      { nombre: 'Gerente', codigo: 'GERENTE', descripcion: 'Gestión de operaciones', activo: true, created_at: now, updated_at: now },
      { nombre: 'Supervisor', codigo: 'SUPERVISOR', descripcion: 'Supervisión de equipos', activo: true, created_at: now, updated_at: now },
      { nombre: 'Operador', codigo: 'OPERADOR', descripcion: 'Operaciones diarias', activo: true, created_at: now, updated_at: now },
      { nombre: 'Usuario', codigo: 'USUARIO', descripcion: 'Acceso básico', activo: true, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
