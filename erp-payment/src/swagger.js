const apiPrefix = "/api/finanzas";

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
    title: "ERP Payment API",
    version: "0.0.1",
    description:
      "Documentación de los endpoints del microservicio de finanzas.",
  },
  servers: [{ url: apiPrefix }],
  tags: [
    { name: "Cuentas por cobrar" },
    { name: "Pagos de clientes" },
    { name: "Cuentas por pagar" },
    { name: "Pagos de proveedores" },
  ],
  components: {
    schemas: {
      Collection: genericObjectSchema,
      PendingCollection: genericObjectSchema,
      Payment: genericObjectSchema,
      PendingPayment: genericObjectSchema,
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/cuentas-por-cobrar": {
      get: {
        tags: ["Cuentas por cobrar"],
        summary: "Listar cuentas por cobrar",
        responses: {
          200: jsonResponse("Lista de cuentas por cobrar", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Cuentas por cobrar"],
        summary: "Crear cuenta por cobrar",
        requestBody: jsonRequestBody,
        responses: {
          201: jsonResponse("Cuenta por cobrar creada", genericObjectSchema),
          400: jsonResponse("Solicitud inválida", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
    "/pagos-clientes": {
      get: {
        tags: ["Pagos de clientes"],
        summary: "Listar pagos de clientes",
        responses: {
          200: jsonResponse("Lista de pagos de clientes", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Pagos de clientes"],
        summary: "Crear pago de cliente",
        requestBody: jsonRequestBody,
        responses: {
          201: jsonResponse("Pago de cliente creado", genericObjectSchema),
          400: jsonResponse("Solicitud inválida", genericObjectSchema),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
    "/cuentas-por-pagar": {
      get: {
        tags: ["Cuentas por pagar"],
        summary: "Listar cuentas por pagar",
        responses: {
          200: jsonResponse("Lista de cuentas por pagar", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
    "/pagos-proveedores": {
      get: {
        tags: ["Pagos de proveedores"],
        summary: "Listar pagos de proveedores",
        responses: {
          200: jsonResponse("Lista de pagos de proveedores", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
    },
  },
};
