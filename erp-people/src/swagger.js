const apiPrefix = "/api/personas";

const genericObjectSchema = {
  type: "object",
  additionalProperties: true,
};

const listResponseSchema = {
  type: "array",
  items: genericObjectSchema,
};

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: {
    type: "string",
  },
};

const jsonRequestBody = {
  required: true,
  content: {
    "application/json": {
      schema: genericObjectSchema,
    },
  },
};

const jsonResponse = (description, schema) => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

const buildCrudPaths = (routeBase, tag, label) => ({
  [routeBase]: {
    get: {
      tags: [tag],
      summary: `Listar ${label}`,
      responses: {
        200: jsonResponse(`Lista de ${label}`, listResponseSchema),
        500: jsonResponse("Error interno del servidor", genericObjectSchema),
      },
    },
    post: {
      tags: [tag],
      summary: `Crear ${label.slice(0, -1)}`,
      requestBody: jsonRequestBody,
      responses: {
        201: jsonResponse(`${label.slice(0, -1)} creado`, genericObjectSchema),
        400: jsonResponse("Solicitud inválida", genericObjectSchema),
        500: jsonResponse("Error interno del servidor", genericObjectSchema),
      },
    },
  },
  [`${routeBase}/{id}`]: {
    get: {
      tags: [tag],
      summary: `Obtener ${label.slice(0, -1)} por id`,
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          `${label.slice(0, -1)} encontrado`,
          genericObjectSchema,
        ),
        400: jsonResponse("ID inválido", genericObjectSchema),
        404: jsonResponse("Recurso no encontrado", genericObjectSchema),
        500: jsonResponse("Error interno del servidor", genericObjectSchema),
      },
    },
    put: {
      tags: [tag],
      summary: `Actualizar ${label.slice(0, -1)}`,
      parameters: [idParam],
      requestBody: jsonRequestBody,
      responses: {
        200: jsonResponse(
          `${label.slice(0, -1)} actualizado`,
          genericObjectSchema,
        ),
        400: jsonResponse("Solicitud inválida", genericObjectSchema),
        404: jsonResponse("Recurso no encontrado", genericObjectSchema),
        500: jsonResponse("Error interno del servidor", genericObjectSchema),
      },
    },
    delete: {
      tags: [tag],
      summary: `Eliminar ${label.slice(0, -1)}`,
      parameters: [idParam],
      responses: {
        200: jsonResponse(
          `${label.slice(0, -1)} eliminado`,
          genericObjectSchema,
        ),
        400: jsonResponse("ID inválido", genericObjectSchema),
        404: jsonResponse("Recurso no encontrado", genericObjectSchema),
        500: jsonResponse("Error interno del servidor", genericObjectSchema),
      },
    },
  },
});

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ERP People API",
    version: "0.0.1",
    description:
      "Documentación de los endpoints del microservicio de personas.",
  },
  servers: [{ url: apiPrefix }],
  tags: [
    { name: "Clientes" },
    { name: "Proveedores" },
    { name: "Cargos" },
    { name: "Empleados" },
    { name: "Usuarios" },
  ],
  components: {
    schemas: {
      Entity: genericObjectSchema,
      EntityList: listResponseSchema,
      Error: genericObjectSchema,
    },
  },
  paths: {
    ...buildCrudPaths("/clientes", "Clientes", "clientes"),
    ...buildCrudPaths("/proveedores", "Proveedores", "proveedores"),
    ...buildCrudPaths("/cargos", "Cargos", "cargos"),
    ...buildCrudPaths("/empleados", "Empleados", "empleados"),
    ...buildCrudPaths("/usuarios", "Usuarios", "usuarios"),
  },
};
