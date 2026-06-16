import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ERP People API',
      version: '1.0.0',
      description: 'Microservicio de gestión de personas, autenticación y roles del ERP MVP',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'OK' },
            data: { type: 'object' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['identifier', 'password'],
          properties: {
            identifier: { type: 'string', example: 'admin', description: 'nombre_usuario o correo_electronico' },
            password: { type: 'string', example: 'Admin123*' },
          },
        },
        LoginResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                    usuario: { $ref: '#/components/schemas/Usuario' },
                  },
                },
              },
            },
          ],
        },
        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        Sucursal: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Casa Matriz' },
            direccion: { type: 'string' },
            ciudad: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        SucursalCreate: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string' },
            direccion: { type: 'string' },
            ciudad: { type: 'string' },
            activo: { type: 'boolean', default: true },
          },
        },
        Cargo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        CargoCreate: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        Empleado: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            sucursal_id: { type: 'integer' },
            cargo_id: { type: 'integer' },
            nombres: { type: 'string' },
            apellido_paterno: { type: 'string' },
            apellido_materno: { type: 'string' },
            numero_documento: { type: 'string' },
            telefono: { type: 'string' },
            correo_electronico: { type: 'string' },
            fecha_ingreso: { type: 'string', format: 'date' },
            activo: { type: 'boolean' },
          },
        },
        EmpleadoCreate: {
          type: 'object',
          required: ['sucursal_id', 'cargo_id', 'nombres', 'apellido_paterno', 'numero_documento', 'fecha_ingreso'],
          properties: {
            sucursal_id: { type: 'integer' },
            cargo_id: { type: 'integer' },
            nombres: { type: 'string' },
            apellido_paterno: { type: 'string' },
            apellido_materno: { type: 'string' },
            numero_documento: { type: 'string' },
            telefono: { type: 'string' },
            correo_electronico: { type: 'string' },
            fecha_ingreso: { type: 'string', format: 'date' },
            activo: { type: 'boolean' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            empleado_id: { type: 'integer' },
            nombre_usuario: { type: 'string' },
            correo_electronico: { type: 'string' },
            activo: { type: 'boolean' },
            roles: { type: 'array', items: { $ref: '#/components/schemas/Rol' } },
          },
        },
        UsuarioCreate: {
          type: 'object',
          required: ['empleado_id', 'nombre_usuario', 'correo_electronico', 'password'],
          properties: {
            empleado_id: { type: 'integer' },
            nombre_usuario: { type: 'string' },
            correo_electronico: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            rol_ids: { type: 'array', items: { type: 'integer' } },
            rol_codigo: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        Rol: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            codigo: { type: 'string' },
            descripcion: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        RolCreate: {
          type: 'object',
          required: ['nombre', 'codigo'],
          properties: {
            nombre: { type: 'string' },
            codigo: { type: 'string' },
            descripcion: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Estado del servicio' },
      { name: 'Auth', description: 'Autenticación y sesiones' },
      { name: 'Sucursales', description: 'Gestión de sucursales' },
      { name: 'Cargos', description: 'Gestión de cargos' },
      { name: 'Empleados', description: 'Gestión de empleados' },
      { name: 'Usuarios', description: 'Gestión de usuarios' },
      { name: 'Roles', description: 'Gestión de roles' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
