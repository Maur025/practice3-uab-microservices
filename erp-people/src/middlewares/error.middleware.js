import { loggerError } from "@maur025/core-logger";
import { AppError } from "../utils/response.js";

export const errorMiddleware = (error, req, res, next) => {
  void next;
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Internal Server Error";
  const details = error instanceof AppError ? error.details : null;

  if (statusCode >= 500) {
    loggerError(`[SERVER] ${error.stack || error.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};
