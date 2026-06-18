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
    version: "0.1.0",
    description:
      "Microservicio de inventarios: catálogo de productos, gestión de stock y movimientos.",
  },
  servers: [{ url: apiPrefix }],
  tags: [
    { name: "Categorías" },
    { name: "Unidades de Medida" },
    { name: "Productos" },
    { name: "Inventario (Stock)" },
    { name: "Movimientos" },
  ],
  components: {
    schemas: {
      Categoria: genericObjectSchema,
      CategoriaList: { type: "array", items: genericObjectSchema },
      Unidad: genericObjectSchema,
      UnidadList: { type: "array", items: genericObjectSchema },
      Product: genericObjectSchema,
      ProductList: { type: "array", items: genericObjectSchema },
      Inventario: genericObjectSchema,
      InventarioList: { type: "array", items: genericObjectSchema },
      Movimiento: genericObjectSchema,
      MovimientoList: { type: "array", items: genericObjectSchema },
      Error: genericObjectSchema,
    },
  },
  paths: {
    "/catalogo/categorias": {
      get: {
        tags: ["Categorías"],
        summary: "Listar categorías",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de categorías", { type: "array", items: genericObjectSchema }),
          500: jsonResponse("Error interno del servidor", genericObjectSchema),
        },
      },
      post: {
        tags: ["Categorías"],
        summary: "Crear categoría",
        responses: {
          201: jsonResponse("Categoría creada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/catalogo/categorias/{id}": {
      get: {
        tags: ["Categorías"],
        summary: "Obtener categoría por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Categoría encontrada", genericObjectSchema),
          404: jsonResponse("Categoría no encontrada", genericObjectSchema),
        },
      },
      put: {
        tags: ["Categorías"],
        summary: "Actualizar categoría",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Categoría actualizada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
          404: jsonResponse("Categoría no encontrada", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Categorías"],
        summary: "Eliminar categoría",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Categoría eliminada", genericObjectSchema),
          404: jsonResponse("Categoría no encontrada", genericObjectSchema),
        },
      },
    },
    "/catalogo/unidades": {
      get: {
        tags: ["Unidades de Medida"],
        summary: "Listar unidades de medida",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de unidades", { type: "array", items: genericObjectSchema }),
        },
      },
      post: {
        tags: ["Unidades de Medida"],
        summary: "Crear unidad de medida",
        responses: {
          201: jsonResponse("Unidad creada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/catalogo/unidades/{id}": {
      get: {
        tags: ["Unidades de Medida"],
        summary: "Obtener unidad por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Unidad encontrada", genericObjectSchema),
          404: jsonResponse("Unidad no encontrada", genericObjectSchema),
        },
      },
      put: {
        tags: ["Unidades de Medida"],
        summary: "Actualizar unidad",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Unidad actualizada", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Unidades de Medida"],
        summary: "Eliminar unidad",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Unidad eliminada", genericObjectSchema),
          404: jsonResponse("Unidad no encontrada", genericObjectSchema),
        },
      },
    },
    "/catalogo/productos": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "id_categoria", in: "query", schema: { type: "integer" } },
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de productos", { type: "array", items: genericObjectSchema }),
        },
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        responses: {
          201: jsonResponse("Producto creado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/catalogo/productos/{id}": {
      get: {
        tags: ["Productos"],
        summary: "Obtener producto por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Producto encontrado", genericObjectSchema),
          404: jsonResponse("Producto no encontrado", genericObjectSchema),
        },
      },
      put: {
        tags: ["Productos"],
        summary: "Actualizar producto",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Producto actualizado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Productos"],
        summary: "Desactivar producto",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Producto desactivado", genericObjectSchema),
          404: jsonResponse("Producto no encontrado", genericObjectSchema),
        },
      },
    },
    "/stock": {
      get: {
        tags: ["Inventario (Stock)"],
        summary: "Listar inventario (stock por sucursal)",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
          { name: "id_producto", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Lista de inventario", { type: "array", items: genericObjectSchema }),
        },
      },
      post: {
        tags: ["Inventario (Stock)"],
        summary: "Crear registro de inventario",
        responses: {
          201: jsonResponse("Inventario creado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/stock/{id}": {
      get: {
        tags: ["Inventario (Stock)"],
        summary: "Obtener inventario por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Inventario encontrado", genericObjectSchema),
          404: jsonResponse("Inventario no encontrado", genericObjectSchema),
        },
      },
      put: {
        tags: ["Inventario (Stock)"],
        summary: "Actualizar inventario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Inventario actualizado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
      delete: {
        tags: ["Inventario (Stock)"],
        summary: "Eliminar registro de inventario",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Inventario eliminado", genericObjectSchema),
          404: jsonResponse("Inventario no encontrado", genericObjectSchema),
        },
      },
    },
    "/stock/inicializar": {
      post: {
        tags: ["Inventario (Stock)"],
        summary: "Inicializar stock existente por sucursal",
        responses: {
          201: jsonResponse("Stock inicializado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/stock/transferir": {
      post: {
        tags: ["Inventario (Stock)"],
        summary: "Transferir stock entre sucursales",
        responses: {
          200: jsonResponse("Transferencia realizada", genericObjectSchema),
          400: jsonResponse("Error de validación o stock insuficiente", genericObjectSchema),
        },
      },
    },
    "/stock/reporte": {
      get: {
        tags: ["Inventario (Stock)"],
        summary: "Reporte de saldo total de stock por empresa",
        parameters: [
          { name: "id_empresa", in: "query", schema: { type: "integer" } },
          { name: "id_producto", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: jsonResponse("Reporte de stock por empresa", { type: "array", items: genericObjectSchema }),
        },
      },
    },
    "/movimientos": {
      get: {
        tags: ["Movimientos"],
        summary: "Listar movimientos de inventario",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "id_sucursal", in: "query", schema: { type: "integer" } },
          { name: "id_producto", in: "query", schema: { type: "integer" } },
          { name: "tipo_movimiento", in: "query", schema: { type: "string" } },
          { name: "fecha_desde", in: "query", schema: { type: "string" } },
          { name: "fecha_hasta", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: jsonResponse("Lista de movimientos", { type: "array", items: genericObjectSchema }),
        },
      },
      post: {
        tags: ["Movimientos"],
        summary: "Registrar movimiento de inventario",
        responses: {
          201: jsonResponse("Movimiento registrado", genericObjectSchema),
          400: jsonResponse("Error de validación", genericObjectSchema),
        },
      },
    },
    "/movimientos/{id}": {
      get: {
        tags: ["Movimientos"],
        summary: "Obtener movimiento por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          200: jsonResponse("Movimiento encontrado", genericObjectSchema),
          404: jsonResponse("Movimiento no encontrado", genericObjectSchema),
        },
      },
    },
  },
};
