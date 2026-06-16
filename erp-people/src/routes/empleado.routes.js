import { Router } from 'express';
import empleadoController from '../controllers/empleado.controller.js';
import { authMiddleware, rolesMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator, empleadoValidator, empleadoUpdateValidator } from '../validators/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', empleadoController.getAll);
router.get('/:id', idParamValidator, validate, empleadoController.getById);
router.post('/', rolesMiddleware('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR'), empleadoValidator, validate, empleadoController.create);
router.put('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE', 'SUPERVISOR'), idParamValidator, empleadoUpdateValidator, validate, empleadoController.update);
router.delete('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, validate, empleadoController.remove);

export default router;
