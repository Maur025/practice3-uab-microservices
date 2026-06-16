import { Router } from 'express';
import proxyController from '../controllers/proxy.controller.js';

const router = Router();

router.get('/', proxyController.proxyGet('/api/roles'));
router.post('/', proxyController.proxyPost('/api/roles'));

export default router;
