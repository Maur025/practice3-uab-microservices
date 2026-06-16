const apiPrefix = "/api/compras";

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
    title: "ERP Purchase API",
    version: "0.0.1",
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
        responses: {
          200: jsonResponse("Lista de compras", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
