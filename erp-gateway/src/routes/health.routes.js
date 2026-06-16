import { Router } from 'express';
import healthController from '../controllers/health.controller.js';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check del gateway y servicios downstream
 *     responses:
 *       200:
 *         description: Todos los servicios saludables
 *       503:
 *         description: Algún servicio no disponible
 */
router.get('/', healthController.check);

export default router;
