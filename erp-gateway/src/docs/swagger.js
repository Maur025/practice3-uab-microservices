import swaggerJsdoc from 'swagger-jsdoc';
import env from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ERP Gateway API',
      version: '1.0.0',
      description: 'API Gateway del ERP MVP - Proxy hacia erp-people',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Gateway local',
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
        LoginRequest: {
          type: 'object',
          required: ['identifier', 'password'],
          properties: {
            identifier: { type: 'string', example: 'admin' },
            password: { type: 'string', example: 'Admin123*' },
          },
        },
        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        SucursalCreate: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre: { type: 'string', example: 'Sucursal Norte' },
            direccion: { type: 'string' },
            ciudad: { type: 'string' },
            activo: { type: 'boolean' },
          },
        },
        CargoCreate: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
          },
        },
        EmpleadoCreate: {
          type: 'object',
          properties: {
            sucursal_id: { type: 'integer' },
            cargo_id: { type: 'integer' },
            nombres: { type: 'string' },
            apellido_paterno: { type: 'string' },
            numero_documento: { type: 'string' },
            fecha_ingreso: { type: 'string', format: 'date' },
          },
        },
        UsuarioCreate: {
          type: 'object',
          properties: {
            empleado_id: { type: 'integer' },
            nombre_usuario: { type: 'string' },
            correo_electronico: { type: 'string' },
            password: { type: 'string' },
            rol_codigo: { type: 'string' },
          },
        },
        RolCreate: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            codigo: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Estado del gateway' },
      { name: 'Auth', description: 'Autenticación' },
      { name: 'Sucursales', description: 'Sucursales' },
      { name: 'Cargos', description: 'Cargos' },
      { name: 'Empleados', description: 'Empleados' },
      { name: 'Usuarios', description: 'Usuarios' },
      { name: 'Roles', description: 'Roles' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
