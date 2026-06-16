import { validationResult } from "express-validator";
import { AppError } from "../utils/response.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Error de validación", 400, errors.array()));
  }
  next();
};
