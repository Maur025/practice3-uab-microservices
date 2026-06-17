import { asyncHandler, successResponse } from "../util/response.js";
import { getPagination, getPaginationMeta } from "../util/pagination.js";
import {
  findAllMovimientos,
  findMovimientoById,
  createMovimiento,
} from "../services/movement.service.js";

export const getMovimientos = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const id_sucursal = req.query.id_sucursal ? Number(req.query.id_sucursal) : undefined;
  const id_producto = req.query.id_producto ? Number(req.query.id_producto) : undefined;
  const tipo_movimiento = req.query.tipo_movimiento || undefined;
  const fecha_desde = req.query.fecha_desde || undefined;
  const fecha_hasta = req.query.fecha_hasta || undefined;
  const { rows, count } = await findAllMovimientos({
    limit, offset, id_sucursal, id_producto, tipo_movimiento, fecha_desde, fecha_hasta,
  });
  const pagination = getPaginationMeta(count, page, limit);
  successResponse(res, rows, 200, "OK", pagination);
});

export const getMovimiento = asyncHandler(async (req, res) => {
  const data = await findMovimientoById(Number(req.params.id));
  successResponse(res, data);
});

export const postMovimiento = asyncHandler(async (req, res) => {
  const data = await createMovimiento(req.body);
  successResponse(res, data, 201, "Movimiento registrado");
});
