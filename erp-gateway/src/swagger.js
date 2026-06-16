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
    title: "ERP Gateway API",
    version: "0.0.1",
    description: "Documentación de los endpoints expuestos por el gateway.",
  },
  servers: [{ url: apiPrefix }],
  tags: [{ name: "Sucursales" }],
  components: {
    schemas: {
      Branch: genericObjectSchema,
      BranchList: {
        type: "array",
        items: genericObjectSchema,
      },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/sucursales": {
      get: {
        tags: ["Sucursales"],
        summary: "Listar sucursales",
        responses: {
          200: jsonResponse("Lista de sucursales", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
