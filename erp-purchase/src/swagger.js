const apiPrefix = "/api/compras";

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
    title: "ERP Purchase API",
    version: "0.1.0",
    description: "Documentación de los endpoints del microservicio de compras.",
  },
  servers: [{ url: apiPrefix }],
  tags: [{ name: "Compras" }],
  components: {
    schemas: {
      Purchase: genericObjectSchema,
      PurchaseList: {
        type: "array",
        items: genericObjectSchema,
      },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/compras": {
      get: {
        tags: ["Compras"],
        summary: "Listar compras",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "id_proveedor", in: "query", schema: { type: "integer" } },
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
          { name: "fecha_desde", in: "query", schema: { type: "string" } },
          { name: "fecha_hasta", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: jsonResponse("Lista de compras", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Compras"],
        summary: "Registrar compra",
        requestBody: jsonRequestBody,
        responses: {
          201: jsonResponse("Compra registrada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
    "/compras/{id}": {
      get: {
        tags: ["Compras"],
        summary: "Obtener compra por ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Compra encontrada", genericObjectSchema),
          404: jsonResponse("Compra no encontrada", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      put: {
        tags: ["Compras"],
        summary: "Anular compra",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: jsonRequestBody,
        responses: {
          200: jsonResponse("Compra anulada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
          404: jsonResponse("Compra no encontrada", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
