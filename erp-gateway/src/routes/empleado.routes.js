import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

router.get('/', proxyController.proxyGet('/api/empleados'));
router.post('/', proxyController.proxyPost('/api/empleados'));

export default router;
