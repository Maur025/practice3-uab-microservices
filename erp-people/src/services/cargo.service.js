import { db } from "../db.js";
import { AppError } from "../utils/response.js";

class CargoService {
  async getAll({ limit, offset } = {}) {
    const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM cargo");
    if (limit != null && offset != null) {
      const [rows] = await db.query(
        "SELECT id_cargo, nombre FROM cargo ORDER BY id_cargo DESC LIMIT ? OFFSET ?",
        [limit, offset],
      );
      return { rows, count };
    }
    const [rows] = await db.query(
      "SELECT id_cargo, nombre FROM cargo ORDER BY id_cargo DESC",
    );
    return { rows, count };
  }

  async getById(id) {
    const [rows] = await db.query(
      "SELECT id_cargo, nombre FROM cargo WHERE id_cargo = ? LIMIT 1",
      [id],
    );
    const cargo = rows[0] ?? null;
    if (!cargo) {
      throw new AppError("Cargo no encontrado", 404);
    }
    return cargo;
  }

  async create(data) {
    const nombre = `${data.nombre ?? ""}`.trim();
    if (!nombre) {
      throw new AppError("El nombre es requerido", 400);
    }

    const [result] = await db.query("INSERT INTO cargo (nombre) VALUES (?)", [
      nombre,
    ]);

    return this.getById(result.insertId);
  }

  async update(id, data) {
    const cargo = await this.getById(id);
    if (data.nombre !== undefined) {
      const nombre = `${data.nombre ?? ""}`.trim();
      if (!nombre) {
        throw new AppError("El nombre no puede estar vacío", 400);
      }
      await db.query("UPDATE cargo SET nombre = ? WHERE id_cargo = ?", [
        nombre,
        id,
      ]);
    }

    return this.getById(cargo.id_cargo);
  }

  async remove(id) {
    const cargo = await this.getById(id);

    try {
      await db.query("DELETE FROM cargo WHERE id_cargo = ?", [id]);
    } catch (error) {
      if (error?.code === "ER_ROW_IS_REFERENCED_2") {
        throw new AppError(
          "No se puede eliminar un cargo asociado a empleados",
          409,
        );
      }
      throw error;
    }

    if (!cargo) {
      throw new AppError("Cargo no encontrado", 404);
    }
    return cargo;
  }
}

export default new CargoService();
