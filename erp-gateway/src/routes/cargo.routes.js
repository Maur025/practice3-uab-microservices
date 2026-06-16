import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

router.get('/', proxyController.proxyGet('/api/cargos'));
router.post('/', proxyController.proxyPost('/api/cargos'));

export default router;
