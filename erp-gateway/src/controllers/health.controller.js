import peopleClient from '../clients/people.client.js';
import env from '../config/env.js';
import { asyncHandler } from '../utils/response.js';

class HealthController {
  check = asyncHandler(async (req, res) => {
    const gatewayHealth = {
      service: 'erp-gateway',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    try {
      const peopleResponse = await peopleClient.get('/api/personas/health', { timeout: 5000 });
      const peopleHealth = peopleResponse.data?.data ?? peopleResponse.data;

      res.status(peopleHealth?.status === 'healthy' ? 200 : 503).json({
        success: peopleHealth?.status === 'healthy',
        message: peopleHealth?.status === 'healthy' ? 'OK' : 'erp-people reporta estado no saludable',
        data: {
          gateway: gatewayHealth,
          people: peopleHealth,
        },
      });
    } catch (error) {
      const reason = error.code === 'ECONNREFUSED'
        ? 'Conexión rechazada — ¿erp-people está corriendo en el puerto 7802?'
        : error.code === 'ECONNABORTED'
          ? 'Timeout — erp-people no respondió a tiempo'
          : error.message;

      res.status(503).json({
        success: false,
        message: 'Gateway operativo pero erp-people no disponible',
        data: {
          gateway: gatewayHealth,
          people: { status: 'down', url: env.peopleServiceUrl, reason },
        },
      });
    }
  });
}

export default new HealthController();
