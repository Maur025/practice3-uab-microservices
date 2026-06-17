import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllCategorias = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM categoria");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM categoria LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM categoria ORDER BY nombre");
  return { rows, count };
};

export const findCategoriaById = async (id) => {
  const [rows] = await db.query("SELECT * FROM categoria WHERE id_categoria = ?", [id]);
  if (rows.length === 0) {
    throw new AppError("Categoría no encontrada", 404);
  }
  return rows[0];
};

export const createCategoria = async (data) => {
  const { nombre } = data;
  const [result] = await db.query("INSERT INTO categoria (nombre) VALUES (?)", [nombre]);
  return findCategoriaById(result.insertId);
};

export const updateCategoria = async (id, data) => {
  await findCategoriaById(id);
  const fields = [];
  const values = [];

  if (data.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(data.nombre);
  }

  if (fields.length === 0) return findCategoriaById(id);

  values.push(id);
  await db.query(`UPDATE categoria SET ${fields.join(", ")} WHERE id_categoria = ?`, values);
  return findCategoriaById(id);
};

export const deleteCategoria = async (id) => {
  await findCategoriaById(id);
  await db.query("DELETE FROM categoria WHERE id_categoria = ?", [id]);
};
