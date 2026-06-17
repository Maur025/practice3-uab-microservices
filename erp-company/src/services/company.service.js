import { db } from "../db.js";
import { AppError } from "../util/response.js";

export const findAllEmpresas = async ({ limit, offset } = {}) => {
  const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM empresa");
  if (limit != null && offset != null) {
    const [rows] = await db.query("SELECT * FROM empresa LIMIT ? OFFSET ?", [limit, offset]);
    return { rows, count };
  }
  const [rows] = await db.query("SELECT * FROM empresa");
  return { rows, count };
};

export const findEmpresaById = async (id) => {
  const [rows] = await db.query("SELECT * FROM empresa WHERE id_empresa = ?", [id]);
  if (rows.length === 0) {
    throw new AppError("Empresa no encontrada", 404);
  }
  return rows[0];
};

export const createEmpresa = async (data) => {
  const { nombre, nit, direccion, telefono, email } = data;
  const [result] = await db.query(
    "INSERT INTO empresa (nombre, nit, direccion, telefono, email) VALUES (?, ?, ?, ?, ?)",
    [nombre, nit, direccion || null, telefono || null, email || null],
  );
  return findEmpresaById(result.insertId);
};

export const updateEmpresa = async (id, data) => {
  const empresa = await findEmpresaById(id);
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    const columnMap = { nombre: "nombre", nit: "nit", direccion: "direccion", telefono: "telefono", email: "email", estado: "estado" };
    const column = columnMap[key];
    if (column !== undefined) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return empresa;

  values.push(id);
  await db.query(`UPDATE empresa SET ${fields.join(", ")} WHERE id_empresa = ?`, values);
  return findEmpresaById(id);
};

export const deleteEmpresa = async (id) => {
  await findEmpresaById(id);
  await db.query("UPDATE empresa SET estado = 0 WHERE id_empresa = ?", [id]);
};

export const findAllSucursales = async ({ limit, offset, id_empresa } = {}) => {
  let query = "SELECT s.*, e.nombre as empresa_nombre FROM sucursal s JOIN empresa e ON s.id_empresa = e.id_empresa";
  let countQuery = "SELECT COUNT(*) as count FROM sucursal";
  const params = [];
  const countParams = [];

  if (id_empresa) {
    query += " WHERE s.id_empresa = ?";
    countQuery += " WHERE id_empresa = ?";
    params.push(id_empresa);
    countParams.push(id_empresa);
  }

  const [[{ count }]] = await db.query(countQuery, countParams);

  query += " ORDER BY s.nombre";
  if (limit != null && offset != null) {
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
  }

  const [rows] = await db.query(query, params);
  return { rows, count };
};

export const findSucursalById = async (id) => {
  const [rows] = await db.query(
    "SELECT s.*, e.nombre as empresa_nombre FROM sucursal s JOIN empresa e ON s.id_empresa = e.id_empresa WHERE s.id_sucursal = ?",
    [id],
  );
  if (rows.length === 0) {
    throw new AppError("Sucursal no encontrada", 404);
  }
  return rows[0];
};

export const createSucursal = async (data) => {
  const { id_empresa, nombre, direccion, ciudad } = data;
  const [result] = await db.query(
    "INSERT INTO sucursal (id_empresa, nombre, direccion, ciudad) VALUES (?, ?, ?, ?)",
    [id_empresa, nombre, direccion || null, ciudad || null],
  );
  return findSucursalById(result.insertId);
};

export const updateSucursal = async (id, data) => {
  const sucursal = await findSucursalById(id);
  const fields = [];
  const values = [];

  const columnMap = {
    id_empresa: "id_empresa",
    nombre: "nombre",
    direccion: "direccion",
    ciudad: "ciudad",
    estado: "estado",
  };

  for (const [key, value] of Object.entries(data)) {
    const column = columnMap[key];
    if (column !== undefined) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return sucursal;

  values.push(id);
  await db.query(`UPDATE sucursal SET ${fields.join(", ")} WHERE id_sucursal = ?`, values);
  return findSucursalById(id);
};

export const deleteSucursal = async (id) => {
  await findSucursalById(id);
  await db.query("UPDATE sucursal SET estado = 0 WHERE id_sucursal = ?", [id]);
};
