import { Router } from 'express';
import healthController from '../controllers/health.controller.js';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check del servicio
 *     responses:
 *       200:
 *         description: Servicio saludable
 *       503:
 *         description: Servicio no saludable
 */
router.get('/', healthController.check);

export default router;
