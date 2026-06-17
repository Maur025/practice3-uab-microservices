import { db } from "../db.js";
import { AppError } from "../utils/response.js";

const employeeSelect = `
  SELECT
    e.id_empleado,
    e.id_sucursal,
    s.nombre AS sucursal_nombre,
    e.id_cargo,
    c.nombre AS cargo_nombre,
    e.nombres,
    e.apellidos,
    e.ci,
    e.telefono,
    e.email,
    e.fecha_ingreso,
    e.estado
  FROM empleado e
  INNER JOIN sucursal s ON s.id_sucursal = e.id_sucursal
  INNER JOIN cargo c ON c.id_cargo = e.id_cargo
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

const buildApellidos = (data, currentEmployee = null) => {
  if (data.apellidos !== undefined) {
    return toText(data.apellidos);
  }

  const currentParts = `${currentEmployee?.apellidos ?? ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const currentPaterno = currentParts.shift() ?? "";
  const currentMaterno = currentParts.join(" ");
  const paterno =
    data.apellido_paterno !== undefined
      ? toText(data.apellido_paterno)
      : currentPaterno;
  const materno =
    data.apellido_materno !== undefined
      ? toText(data.apellido_materno)
      : currentMaterno;
  return [paterno, materno].filter(Boolean).join(" ");
};

const findEmployeeById = async (id) => {
  const [rows] = await db.query(
    `${employeeSelect} WHERE e.id_empleado = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
};

const ensureSucursalExists = async (idSucursal) => {
  const [rows] = await db.query(
    "SELECT id_sucursal FROM sucursal WHERE id_sucursal = ? LIMIT 1",
    [idSucursal],
  );

  if (rows.length === 0) {
    throw new AppError("Sucursal no encontrada", 404);
  }
};

const ensureCargoExists = async (idCargo) => {
  const [rows] = await db.query(
    "SELECT id_cargo FROM cargo WHERE id_cargo = ? LIMIT 1",
    [idCargo],
  );

  if (rows.length === 0) {
    throw new AppError("Cargo no encontrado", 404);
  }
};

class EmpleadoService {
  async getAll({ limit, offset } = {}) {
    const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM empleado");
    if (limit != null && offset != null) {
      const [rows] = await db.query(
        `${employeeSelect} ORDER BY e.id_empleado DESC LIMIT ? OFFSET ?`,
        [limit, offset],
      );
      return { rows, count };
    }
    const [rows] = await db.query(
      `${employeeSelect} ORDER BY e.id_empleado DESC`,
    );
    return { rows, count };
  }

  async getById(id) {
    const empleado = await findEmployeeById(id);
    if (!empleado) {
      throw new AppError("Empleado no encontrado", 404);
    }
    return empleado;
  }

  async create(data) {
    const required = [
      "sucursal_id",
      "cargo_id",
      "nombres",
      "apellido_paterno",
      "numero_documento",
      "fecha_ingreso",
    ];
    for (const field of required) {
      if (!data[field]) {
        throw new AppError(`El campo ${field} es requerido`, 400);
      }
    }

    await ensureSucursalExists(data.sucursal_id);
    await ensureCargoExists(data.cargo_id);

    const nombres = toText(data.nombres);
    const apellidos = buildApellidos(data);
    const ci = toText(data.numero_documento);

    if (!nombres) {
      throw new AppError("El campo nombres es requerido", 400);
    }

    if (!apellidos) {
      throw new AppError("El campo apellidos es requerido", 400);
    }

    if (!ci) {
      throw new AppError("El campo numero_documento es requerido", 400);
    }

    const [result] = await db.query(
      `INSERT INTO empleado
       (id_sucursal, id_cargo, nombres, apellidos, ci, telefono, email, fecha_ingreso, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.sucursal_id,
        data.cargo_id,
        nombres,
        apellidos,
        ci,
        toText(data.telefono),
        toText(data.correo_electronico),
        data.fecha_ingreso,
        toState(data.activo),
      ],
    );

    return this.getById(result.insertId);
  }

  async update(id, data) {
    const currentEmployee = await this.getById(id);
    const updates = [];
    const values = [];

    if (data.sucursal_id !== undefined) {
      await ensureSucursalExists(data.sucursal_id);
      updates.push("id_sucursal = ?");
      values.push(data.sucursal_id);
    }

    if (data.cargo_id !== undefined) {
      await ensureCargoExists(data.cargo_id);
      updates.push("id_cargo = ?");
      values.push(data.cargo_id);
    }

    if (data.nombres !== undefined) {
      const nombres = toText(data.nombres);
      if (!nombres) {
        throw new AppError("El campo nombres no puede estar vacío", 400);
      }
      updates.push("nombres = ?");
      values.push(nombres);
    }

    if (
      data.apellido_paterno !== undefined ||
      data.apellido_materno !== undefined ||
      data.apellidos !== undefined
    ) {
      const apellidos = buildApellidos(data, currentEmployee);
      if (!apellidos) {
        throw new AppError("El campo apellidos no puede estar vacío", 400);
      }
      updates.push("apellidos = ?");
      values.push(apellidos);
    }

    if (data.numero_documento !== undefined) {
      updates.push("ci = ?");
      values.push(toText(data.numero_documento));
    }

    if (data.telefono !== undefined) {
      updates.push("telefono = ?");
      values.push(toText(data.telefono));
    }

    if (data.correo_electronico !== undefined) {
      updates.push("email = ?");
      values.push(toText(data.correo_electronico));
    }

    if (data.fecha_ingreso !== undefined) {
      updates.push("fecha_ingreso = ?");
      values.push(data.fecha_ingreso);
    }

    if (data.activo !== undefined) {
      updates.push("estado = ?");
      values.push(toState(data.activo, currentEmployee.estado));
    }

    if (updates.length > 0) {
      await db.query(
        `UPDATE empleado SET ${updates.join(", ")} WHERE id_empleado = ?`,
        [...values, id],
      );
    }

    return this.getById(id);
  }

  async remove(id) {
    const empleado = await this.getById(id);
    await db.query("UPDATE empleado SET estado = 0 WHERE id_empleado = ?", [
      id,
    ]);
    if (!empleado) {
      throw new AppError("Empleado no encontrado", 404);
    }
    return empleado;
  }
}

export default new EmpleadoService();
