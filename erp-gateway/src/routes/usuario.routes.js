import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

router.get('/', proxyController.proxyGet('/api/usuarios'));
router.post('/', proxyController.proxyPost('/api/usuarios'));

export default router;
