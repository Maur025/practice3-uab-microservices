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
  pagination = null,
) => {
  const response = {
    code: statusCode,
    data: data ?? null,
    message,
  };
  if (pagination) {
    response.pagination = pagination;
  }
  res.status(statusCode).json(response);
};
