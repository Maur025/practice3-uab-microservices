import { validationResult } from "express-validator";

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const successResponse = (res, data, code = 200, message = "OK", pagination = null) => {
  const body = { code, data, message };
  if (pagination) body.pagination = pagination;
  res.status(code).json(body);
};

export const validationResultMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      data: null,
      message: errors.array().map((e) => e.msg).join(", "),
    });
  }
  next();
};
