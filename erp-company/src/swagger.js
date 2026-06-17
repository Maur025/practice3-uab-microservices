const apiPrefix = "/api/organizaciones";

const genericObjectSchema = {
  type: "object",
  additionalProperties: true,
};

const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ERP Company API",
    version: "0.0.1",
    description:
      "Documentación de los endpoints del microservicio de empresa.",
  },
  servers: [{ url: apiPrefix }],
  tags: [
    { name: "Empresas" },
    { name: "Sucursales" },
  ],
  components: {
    schemas: {
      Empresa: genericObjectSchema,
      EmpresaList: {
        type: "array",
        items: genericObjectSchema,
      },
      Sucursal: genericObjectSchema,
      SucursalList: {
        type: "array",
        items: genericObjectSchema,
      },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/empresas": {
      get: {
        tags: ["Empresas"],
        summary: "Listar empresas",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de empresas", { type: "array", items: genericObjectSchema }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Empresas"],
        summary: "Crear empresa",
        responses: {
          201: jsonResponse("Empresa creada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/empresas/{id}": {
      get: {
        tags: ["Empresas"],
        summary: "Obtener empresa por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Empresa encontrada", genericObjectSchema),
          404: jsonResponse("Empresa no encontrada", genericObjectSchema),
        },
      },
      put: {
        tags: ["Empresas"],
        summary: "Actualizar empresa",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Empresa actualizada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
          404: jsonResponse("Empresa no encontrada", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Empresas"],
        summary: "Desactivar empresa",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Empresa desactivada", genericObjectSchema),
          404: jsonResponse("Empresa no encontrada", genericObjectSchema),
        },
      },
    },
    "/sucursales": {
      get: {
        tags: ["Sucursales"],
        summary: "Listar sucursales",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "id_empresa", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de sucursales", { type: "array", items: genericObjectSchema }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Sucursales"],
        summary: "Crear sucursal",
        responses: {
          201: jsonResponse("Sucursal creada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/sucursales/{id}": {
      get: {
        tags: ["Sucursales"],
        summary: "Obtener sucursal por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Sucursal encontrada", genericObjectSchema),
          404: jsonResponse("Sucursal no encontrada", genericObjectSchema),
        },
      },
      put: {
        tags: ["Sucursales"],
        summary: "Actualizar sucursal",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Sucursal actualizada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
          404: jsonResponse("Sucursal no encontrada", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Sucursales"],
        summary: "Desactivar sucursal",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Sucursal desactivada", genericObjectSchema),
          404: jsonResponse("Sucursal no encontrada", genericObjectSchema),
        },
      },
    },
  },
};
