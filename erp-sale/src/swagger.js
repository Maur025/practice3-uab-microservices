const apiPrefix = "/api/ventas";

const genericObjectSchema = {
  type: "object",
  additionalProperties: true,
};

const paginationSchema = {
  type: "object",
  properties: {
    count: { type: "integer" },
    pages: { type: "integer" },
  },
};

const standardResponse = (description, dataSchema = genericObjectSchema) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          code: { type: "integer" },
          data: dataSchema,
          message: { type: "string" },
          pagination: paginationSchema,
        },
      },
    },
  },
});

const pdfResponse = (description) => ({
  description,
  content: {
    "application/pdf": {},
  },
});

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "ERP Sale API",
    version: "0.1.0",
    description: "Documentación del microservicio de ventas. Incluye ventas, facturación PDF, reportes de ingresos y estadísticas de clientes.",
  },
  servers: [{ url: apiPrefix }],
  tags: [
    { name: "Ventas", description: "CRUD de ventas" },
    { name: "Facturas", description: "Generación de PDF de facturas" },
    { name: "Reportes", description: "Reportes de ingresos" },
    { name: "Clientes", description: "Estadísticas de fidelización" },
  ],
  components: {
    schemas: {
      Sale: genericObjectSchema,
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/ventas": {
      get: {
        tags: ["Ventas"],
        summary: "Listar ventas",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: standardResponse("Lista de ventas", {
            type: "array",
            items: genericObjectSchema,
          }),
          500: standardResponse("Error interno", genericObjectSchema),
        },
      },
      post: {
        tags: ["Ventas"],
        summary: "Crear venta",
        description: "Registra una venta con su carrito, descuenta stock, crea factura y opcionalmente genera CxC",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id_sucursal", "id_usuario", "tipo_pago", "carrito"],
                properties: {
                  id_sucursal: { type: "integer" },
                  id_usuario: { type: "integer" },
                  tipo_pago: { type: "string", enum: ["CONTADO", "CREDITO"] },
                  id_cliente: { type: "integer", nullable: true },
                  descuento: { type: "number" },
                  nit_cliente: { type: "string" },
                  razon_social_cliente: { type: "string" },
                  carrito: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["id_producto", "cantidad", "precio_unitario"],
                      properties: {
                        id_producto: { type: "integer" },
                        cantidad: { type: "number" },
                        precio_unitario: { type: "number" },
                        descripcion: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: standardResponse("Venta creada"),
          400: standardResponse("Solicitud inválida"),
          500: standardResponse("Error interno"),
        },
      },
    },
    "/ventas/{id}": {
      get: {
        tags: ["Ventas"],
        summary: "Obtener venta por ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: standardResponse("Venta encontrada"),
          404: standardResponse("Venta no encontrada"),
        },
      },
      put: {
        tags: ["Ventas"],
        summary: "Anular venta",
        description: "Cambia el estado de la venta y factura a ANULADA. Restaura el stock.",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  estado: { type: "string", enum: ["ANULADA"] },
                },
              },
            },
          },
        },
        responses: {
          200: standardResponse("Venta anulada"),
          400: standardResponse("Solicitud inválida"),
          404: standardResponse("Venta no encontrada"),
        },
      },
    },
    "/ventas/facturas/{id}/pdf": {
      get: {
        tags: ["Facturas"],
        summary: "Generar PDF de factura",
        description: "Retorna un PDF con los datos de la factura y detalle_factura. Content-Type: application/pdf",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID de la venta" },
        ],
        responses: {
          200: pdfResponse("PDF de factura"),
          404: standardResponse("Factura no encontrada"),
          500: standardResponse("Error interno"),
        },
      },
    },
    "/ventas/reportes/ingresos": {
      get: {
        tags: ["Reportes"],
        summary: "Reporte de ingresos",
        description: "Obtiene el resumen de ingresos por rango de fechas y sucursal",
        parameters: [
          { name: "fecha", in: "query", schema: { type: "string", format: "date" }, description: "Fecha específica (YYYY-MM-DD)" },
          { name: "fecha_desde", in: "query", schema: { type: "string", format: "date" }, description: "Inicio del rango" },
          { name: "fecha_hasta", in: "query", schema: { type: "string", format: "date" }, description: "Fin del rango" },
          { name: "id_sucursal", in: "query", schema: { type: "integer" }, description: "Filtrar por sucursal" },
        ],
        responses: {
          200: standardResponse("Reporte de ingresos"),
          500: standardResponse("Error interno"),
        },
      },
    },
    "/ventas/clientes/top": {
      get: {
        tags: ["Clientes"],
        summary: "Top clientes por gasto",
        parameters: [
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: standardResponse("Top clientes"),
        },
      },
    },
    "/ventas/clientes/{id}/fidelizacion": {
      get: {
        tags: ["Clientes"],
        summary: "Estadísticas de fidelización de cliente",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: standardResponse("Estadísticas de fidelización"),
          404: standardResponse("Cliente no encontrado"),
        },
      },
    },
  },
};
