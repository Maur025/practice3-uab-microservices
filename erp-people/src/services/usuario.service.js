import { db } from "../db.js";
import { AppError } from "../utils/response.js";
import { hashPassword } from "../utils/password.js";

const userSelect = `
  SELECT
    u.id_usuario,
    u.id_empleado,
    e.nombres AS empleado_nombres,
    e.apellidos AS empleado_apellidos,
    u.username,
    u.password_hash,
    u.rol,
    u.estado
  FROM usuario u
  INNER JOIN empleado e ON e.id_empleado = u.id_empleado
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

const findUserById = async (id) => {
  const [rows] = await db.query(
    `${userSelect} WHERE u.id_usuario = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

const ensureEmployeeExists = async (employeeId) => {
  const [rows] = await db.query(
    "SELECT id_empleado FROM empleado WHERE id_empleado = ? LIMIT 1",
    [employeeId],
  );

  if (rows.length === 0) {
    throw new AppError("Empleado no encontrado", 404);
  }
};

class UsuarioService {
  async getAll() {
    const [rows] = await db.query(`${userSelect} ORDER BY u.id_usuario DESC`);
    return rows;
  }

  async getById(id) {
    const usuario = await findUserById(id);
    if (!usuario) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return usuario;
  }

  async create(data) {
    const required = ["empleado_id", "password"];
    for (const field of required) {
      if (!data[field]) {
        throw new AppError(`El campo ${field} es requerido`, 400);
      }
    }

    const username = toText(data.username ?? data.nombre_usuario);
    if (!username) {
      throw new AppError("El campo username es requerido", 400);
    }

    await ensureEmployeeExists(data.empleado_id);

    const passwordHash = await hashPassword(data.password);

    const [result] = await db.query(
      `INSERT INTO usuario (id_empleado, username, password_hash, rol, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.empleado_id,
        username,
        passwordHash,
        toText(data.rol ?? data.rol_codigo) ?? "USUARIO",
        toState(data.activo),
      ],
    );

    return this.getById(result.insertId);
  }

  async update(id, data) {
    await this.getById(id);
    const updates = [];
    const values = [];

    if (data.empleado_id !== undefined) {
      await ensureEmployeeExists(data.empleado_id);
      updates.push("id_empleado = ?");
      values.push(data.empleado_id);
    }

    if (data.username !== undefined || data.nombre_usuario !== undefined) {
      const username = toText(data.username ?? data.nombre_usuario);
      if (!username) {
        throw new AppError("El campo username no puede estar vacío", 400);
      }
      updates.push("username = ?");
      values.push(username);
    }

    if (data.password) {
      updates.push("password_hash = ?");
      values.push(await hashPassword(data.password));
    }

    if (data.rol !== undefined || data.rol_codigo !== undefined) {
      const rol = toText(data.rol ?? data.rol_codigo);
      if (!rol) {
        throw new AppError("El campo rol no puede estar vacío", 400);
      }
      updates.push("rol = ?");
      values.push(rol);
    }

    if (data.activo !== undefined) {
      updates.push("estado = ?");
      values.push(toState(data.activo));
    }

    if (updates.length > 0) {
      await db.query(
        `UPDATE usuario SET ${updates.join(", ")} WHERE id_usuario = ?`,
        [...values, id],
      );
    }

    return this.getById(id);
  }

  async remove(id) {
    const usuario = await this.getById(id);
    await db.query("UPDATE usuario SET estado = 0 WHERE id_usuario = ?", [id]);
    if (!usuario) {
      throw new AppError("Usuario no encontrado", 404);
    }
    return usuario;
  }
}

export default new UsuarioService();
