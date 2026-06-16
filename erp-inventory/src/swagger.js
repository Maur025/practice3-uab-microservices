const apiPrefix = "/api/inventarios";

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
    title: "ERP Inventory API",
    version: "0.0.1",
    description:
      "Documentación de los endpoints del microservicio de inventarios.",
  },
  servers: [{ url: apiPrefix }],
  tags: [{ name: "Productos" }],
  components: {
    schemas: {
      Product: genericObjectSchema,
      ProductList: {
        type: "array",
        items: genericObjectSchema,
      },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/catalogo/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos del catálogo",
        responses: {
          200: jsonResponse("Lista de productos", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
