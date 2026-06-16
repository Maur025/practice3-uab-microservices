import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

/**
 * @swagger
 * /api/sucursales:
 *   get:
 *     tags: [Sucursales]
 *     summary: Listar sucursales (proxy)
 *     security:
 *       - bearerAuth: []
 */
router.get('/', proxyController.proxyGet('/api/sucursales'));

/**
 * @swagger
 * /api/sucursales:
 *   post:
 *     tags: [Sucursales]
 *     summary: Crear sucursal (proxy)
 *     security:
 *       - bearerAuth: []
 */
router.post('/', proxyController.proxyPost('/api/sucursales'));

export default router;
