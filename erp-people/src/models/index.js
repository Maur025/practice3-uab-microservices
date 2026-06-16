import Sucursal from './Sucursal.js';
import Cargo from './Cargo.js';
import Empleado from './Empleado.js';
import Usuario from './Usuario.js';
import Rol from './Rol.js';
import UsuarioRol from './UsuarioRol.js';

// Sucursal 1:N Empleados
Sucursal.hasMany(Empleado, { foreignKey: 'sucursal_id', as: 'empleados' });
Empleado.belongsTo(Sucursal, { foreignKey: 'sucursal_id', as: 'sucursal' });

// Cargo 1:N Empleados
Cargo.hasMany(Empleado, { foreignKey: 'cargo_id', as: 'empleados' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargo_id', as: 'cargo' });

// Empleado 1:1 Usuario
Empleado.hasOne(Usuario, { foreignKey: 'empleado_id', as: 'usuario' });
Usuario.belongsTo(Empleado, { foreignKey: 'empleado_id', as: 'empleado' });

// Usuario N:M Rol (via UsuarioRol)
Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'usuario_id',
  otherKey: 'rol_id',
  as: 'roles',
});
Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'rol_id',
  otherKey: 'usuario_id',
  as: 'usuarios',
});

UsuarioRol.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
UsuarioRol.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

export {
  Sucursal,
  Cargo,
  Empleado,
  Usuario,
  Rol,
  UsuarioRol,
};
