import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllUnidades = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM unidad_medida");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM unidad_medida LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM unidad_medida ORDER BY nombre");
  return { rows, count };
};

export const findUnidadById = async (id) => {
  const [rows] = await db.query("SELECT * FROM unidad_medida WHERE id_unidad = ?", [id]);
  if (rows.length === 0) {
    throw new AppError("Unidad no encontrada", 404);
  }
  return rows[0];
};

export const createUnidad = async (data) => {
  const { nombre, abreviatura } = data;
  const [result] = await db.query(
    "INSERT INTO unidad_medida (nombre, abreviatura) VALUES (?, ?)",
    [nombre, abreviatura],
  );
  return findUnidadById(result.insertId);
};

export const updateUnidad = async (id, data) => {
  await findUnidadById(id);
  const fields = [];
  const values = [];

  if (data.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(data.nombre);
  }
  if (data.abreviatura !== undefined) {
    fields.push("abreviatura = ?");
    values.push(data.abreviatura);
  }

  if (fields.length === 0) return findUnidadById(id);

  values.push(id);
  await db.query(`UPDATE unidad_medida SET ${fields.join(", ")} WHERE id_unidad = ?`, values);
  return findUnidadById(id);
};

export const deleteUnidad = async (id) => {
  await findUnidadById(id);
  await db.query("DELETE FROM unidad_medida WHERE id_unidad = ?", [id]);
};
