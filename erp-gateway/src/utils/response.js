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

export const forwardResponse = (res, axiosResponse) => {
  res.status(axiosResponse.status).json(axiosResponse.data);
};

export const handleAxiosError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    throw new AppError(data?.message || 'Error del servicio downstream', status, data?.details);
  }
  if (error.request) {
    throw new AppError('Servicio erp-people no disponible', 503);
  }
  throw new AppError(error.message || 'Error interno', 500);
};
