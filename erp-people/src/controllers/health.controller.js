import healthService from '../services/health.service.js';
import { asyncHandler, successResponse } from '../utils/response.js';

class HealthController {
  check = asyncHandler(async (req, res) => {
    const health = await healthService.check();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    successResponse(res, health, statusCode);
  });
}

export default new HealthController();
