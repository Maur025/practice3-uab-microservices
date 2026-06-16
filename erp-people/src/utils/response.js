export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const successResponse = (
  res,
  data,
  statusCode = 200,
  message = "OK",
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
