import { Router } from 'express';
import rolController from '../controllers/rol.controller.js';
import { authMiddleware, rolesMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator, rolValidator, rolUpdateValidator } from '../validators/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', rolController.getAll);
router.get('/:id', idParamValidator, validate, rolController.getById);
router.post('/', rolesMiddleware('ADMINISTRADOR'), rolValidator, validate, rolController.create);
router.put('/:id', rolesMiddleware('ADMINISTRADOR'), idParamValidator, rolUpdateValidator, validate, rolController.update);
router.delete('/:id', rolesMiddleware('ADMINISTRADOR'), idParamValidator, validate, rolController.remove);

export default router;
