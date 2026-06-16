import { Router } from 'express';
import sucursalController from '../controllers/sucursal.controller.js';
import { authMiddleware, rolesMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator, sucursalValidator, sucursalUpdateValidator } from '../validators/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', sucursalController.getAll);
router.get('/:id', idParamValidator, validate, sucursalController.getById);
router.post('/', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), sucursalValidator, validate, sucursalController.create);
router.put('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, sucursalUpdateValidator, validate, sucursalController.update);
router.delete('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, validate, sucursalController.remove);

export default router;
