import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllProducts = async ({ limit, offset, id_categoria, id_sucursal } = {}) => {
  let query = "SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre, u.abreviatura as unidad_abreviatura";
  let countQuery = "SELECT COUNT(*) as count";
  let fromClause = " FROM producto p JOIN categoria c ON p.id_categoria = c.id_categoria JOIN unidad_medida u ON p.id_unidad = u.id_unidad";
  const params = [];
  const countParams = [];
  const conditions = [];

  if (id_sucursal) {
    fromClause += " LEFT JOIN inventario i ON p.id_producto = i.id_producto AND i.id_sucursal = ?";
    query += ", COALESCE(i.stock_actual, 0) as stock_actual, COALESCE(i.stock_minimo, 0) as stock_minimo";
    params.push(id_sucursal);
    fromClause += " LEFT JOIN inventario inv_count ON p.id_producto = inv_count.id_producto AND inv_count.id_sucursal = ?";
    countParams.push(id_sucursal);
  }

  query += fromClause;
  countQuery += fromClause;

  if (id_categoria) {
    conditions.push("p.id_categoria = ?");
    params.push(id_categoria);
    countParams.push(id_categoria);
  }

  if (conditions.length > 0) {
    const where = " WHERE " + conditions.join(" AND ");
    query += where;
    countQuery += where;
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY p.nombre";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findProductById = async (id) => {
  const [rows] = await db.query(
    `SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre, u.abreviatura as unidad_abreviatura
     FROM producto p
     JOIN categoria c ON p.id_categoria = c.id_categoria
     JOIN unidad_medida u ON p.id_unidad = u.id_unidad
     WHERE p.id_producto = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Producto no encontrado", 404);
  }
  return rows[0];
};

export const createProduct = async (data) => {
  const { id_categoria, id_unidad, codigo, nombre, descripcion, precio_venta, costo } = data;
  const [result] = await db.query(
    "INSERT INTO producto (id_categoria, id_unidad, codigo, nombre, descripcion, precio_venta, costo) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id_categoria, id_unidad, codigo || null, nombre, descripcion || null, precio_venta, costo ?? null],
  );
  return findProductById(result.insertId);
};

export const updateProduct = async (id, data) => {
  await findProductById(id);
  const fields = [];
  const values = [];

  const columnMap = {
    id_categoria: "id_categoria",
    id_unidad: "id_unidad",
    codigo: "codigo",
    nombre: "nombre",
    descripcion: "descripcion",
    precio_venta: "precio_venta",
    costo: "costo",
    estado: "estado",
  };

  for (const [key, value] of Object.entries(data)) {
    const column = columnMap[key];
    if (column !== undefined) {
      if (key === "costo" && value === null) {
        fields.push(`${column} = NULL`);
      } else {
        fields.push(`${column} = ?`);
        values.push(value);
      }
    }
  }

  if (fields.length === 0) return findProductById(id);

  values.push(id);
  await db.query(`UPDATE producto SET ${fields.join(", ")} WHERE id_producto = ?`, values);
  return findProductById(id);
};

export const deleteProduct = async (id) => {
  await findProductById(id);
  await db.query("UPDATE producto SET estado = 0 WHERE id_producto = ?", [id]);
};
