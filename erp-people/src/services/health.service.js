import sequelize from '../config/sequelize.js';

class HealthService {
  async check() {
    const start = Date.now();
    let dbStatus = 'up';

    try {
      await sequelize.authenticate();
    } catch {
      dbStatus = 'down';
    }

    return {
      service: 'erp-people',
      status: dbStatus === 'up' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      responseTime: `${Date.now() - start}ms`,
    };
  }
}

export default new HealthService();
