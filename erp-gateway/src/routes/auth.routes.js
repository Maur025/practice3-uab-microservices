import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión (proxy a erp-people)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             identifier: admin
 *             password: Admin123*
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', proxyController.proxyPost('/api/auth/login'));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renovar token (proxy)
 */
router.post('/refresh', proxyController.proxyPost('/api/auth/refresh'));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión (proxy)
 *     security:
 *       - bearerAuth: []
 */
router.post('/logout', proxyController.proxyPost('/api/auth/logout'));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Perfil del usuario (proxy)
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', proxyController.proxyGet('/api/auth/me'));

export default router;
