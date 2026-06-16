const apiPrefix = "/api/ventas";

const genericObjectSchema = {
  type: "object",
  additionalProperties: true,
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

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ERP Sale API",
    version: "0.0.1",
    description: "Documentación de los endpoints del microservicio de ventas.",
  },
  servers: [{ url: apiPrefix }],
  tags: [{ name: "Ventas" }],
  components: {
    schemas: {
      Sale: genericObjectSchema,
      SaleList: {
        type: "array",
        items: genericObjectSchema,
      },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/ventas": {
      get: {
        tags: ["Ventas"],
        summary: "Listar ventas",
        responses: {
          200: jsonResponse("Lista de ventas", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Ventas"],
        summary: "Crear venta",
        requestBody: jsonRequestBody,
        responses: {
          201: jsonResponse("Venta creada", genericObjectSchema),
          400: jsonResponse("Solicitud inválida", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
    "/ventas/{id}": {
      get: {
        tags: ["Ventas"],
        summary: "Obtener venta por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: jsonResponse("Venta encontrada", genericObjectSchema),
          400: jsonResponse("ID inválido", genericObjectSchema),
          404: jsonResponse("Venta no encontrada", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      put: {
        tags: ["Ventas"],
        summary: "Actualizar estado de venta",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: jsonRequestBody,
        responses: {
          200: jsonResponse("Venta actualizada", genericObjectSchema),
          400: jsonResponse("Solicitud inválida", genericObjectSchema),
          404: jsonResponse("Venta no encontrada", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
