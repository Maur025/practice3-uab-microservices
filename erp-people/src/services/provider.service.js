import { db } from "../db.js";
import { AppError } from "../utils/response.js";

const providerSelect = `
  SELECT
    id_proveedor,
    razon_social,
    nit,
    telefono,
    email,
    direccion,
    estado
  FROM proveedor
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

const fetchProviderById = async (id) => {
  const [rows] = await db.query(
    `${providerSelect} WHERE id_proveedor = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

export const findAllProviders = async () => {
  const [rows] = await db.query(`${providerSelect} ORDER BY id_proveedor DESC`);
  return rows;
};

export const findProviderById = async (id) => fetchProviderById(id);

export const createProvider = async (data) => {
  const razonSocial = toText(data.razon_social);
  if (!razonSocial) {
    throw new AppError("El campo razon_social es requerido", 400);
  }

  const [result] = await db.query(
    `INSERT INTO proveedor (razon_social, nit, telefono, email, direccion, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      razonSocial,
      toText(data.nit),
      toText(data.telefono),
      toText(data.email),
      toText(data.direccion),
      toState(data.estado),
    ],
  );

  return fetchProviderById(result.insertId);
};

export const updateProvider = async (id, data) => {
  const provider = await fetchProviderById(id);
  if (!provider) {
    throw new AppError("Proveedor no encontrado", 404);
  }

  const updates = [];
  const values = [];

  if (data.razon_social !== undefined) {
    const razonSocial = toText(data.razon_social);
    if (!razonSocial) {
      throw new AppError("El campo razon_social no puede estar vacío", 400);
    }
    updates.push("razon_social = ?");
    values.push(razonSocial);
  }

  if (data.nit !== undefined) {
    updates.push("nit = ?");
    values.push(toText(data.nit));
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
    values.push(toState(data.estado, provider.estado));
  }

  if (updates.length > 0) {
    await db.query(
      `UPDATE proveedor SET ${updates.join(", ")} WHERE id_proveedor = ?`,
      [...values, id],
    );
  }

  return fetchProviderById(id);
};

export const deleteProvider = async (id) => {
  const provider = await fetchProviderById(id);
  if (!provider) {
    throw new AppError("Proveedor no encontrado", 404);
  }

  await db.query("UPDATE proveedor SET estado = 0 WHERE id_proveedor = ?", [
    id,
  ]);
  return fetchProviderById(id);
};

export default {
  findAllProviders,
  findProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
};
