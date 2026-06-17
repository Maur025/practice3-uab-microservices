import { db } from "../db.js";
import { AppError } from "../utils/response.js";

const clientSelect = `
  SELECT
    id_cliente,
    nombres,
    apellidos,
    nit_ci,
    telefono,
    email,
    direccion,
    estado
  FROM cliente
`;

const toText = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const text = `${value}`.trim();
  return text.length > 0 ? text : null;
};

const toState = (value, fallback = 1) => {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return Number(value) ? 1 : 0;
};

const fetchClientById = async (id) => {
  const [rows] = await db.query(
    `${clientSelect} WHERE id_cliente = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

export const findAllClients = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM cliente");
  if (limit != null && offset != null) {
    const [rows] = await db.query(`${clientSelect} ORDER BY id_cliente DESC LIMIT ? OFFSET ?`, [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query(`${clientSelect} ORDER BY id_cliente DESC`);
  return { rows, count };
};

export const findClientById = async (id) => fetchClientById(id);

export const createClient = async (data) => {
  const nombres = toText(data.nombres);
  if (!nombres) {
    throw new AppError("El campo nombres es requerido", 400);
  }

  const [result] = await db.query(
    `INSERT INTO cliente (nombres, apellidos, nit_ci, telefono, email, direccion, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombres,
      toText(data.apellidos),
      toText(data.nit_ci),
      toText(data.telefono),
      toText(data.email),
      toText(data.direccion),
      toState(data.estado),
    ],
  );

  return fetchClientById(result.insertId);
};

export const updateClient = async (id, data) => {
  const client = await fetchClientById(id);
  if (!client) {
    throw new AppError("Cliente no encontrado", 404);
  }

  const updates = [];
  const values = [];

  if (data.nombres !== undefined) {
    const nombres = toText(data.nombres);
    if (!nombres) {
      throw new AppError("El campo nombres no puede estar vacío", 400);
    }
    updates.push("nombres = ?");
    values.push(nombres);
  }

  if (data.apellidos !== undefined) {
    updates.push("apellidos = ?");
    values.push(toText(data.apellidos));
  }

  if (data.nit_ci !== undefined) {
    updates.push("nit_ci = ?");
    values.push(toText(data.nit_ci));
  }

  if (data.telefono !== undefined) {
    updates.push("telefono = ?");
    values.push(toText(data.telefono));
  }

  if (data.email !== undefined) {
    updates.push("email = ?");
    values.push(toText(data.email));
  }

  if (data.direccion !== undefined) {
    updates.push("direccion = ?");
    values.push(toText(data.direccion));
  }

  if (data.estado !== undefined) {
    updates.push("estado = ?");
    values.push(toState(data.estado, client.estado));
  }

  if (updates.length > 0) {
    await db.query(
      `UPDATE cliente SET ${updates.join(", ")} WHERE id_cliente = ?`,
      [...values, id],
    );
  }

  return fetchClientById(id);
};

export const deleteClient = async (id) => {
  const client = await fetchClientById(id);
  if (!client) {
    throw new AppError("Cliente no encontrado", 404);
  }

  await db.query("UPDATE cliente SET estado = 0 WHERE id_cliente = ?", [id]);
  return fetchClientById(id);
};

export default {
  findAllClients,
  findClientById,
  createClient,
  updateClient,
  deleteClient,
};
