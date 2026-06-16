import { Router } from 'express';
import usuarioController from '../controllers/usuario.controller.js';
import { authMiddleware, rolesMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator, usuarioValidator, usuarioUpdateValidator } from '../validators/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), usuarioController.getAll);
router.get('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, validate, usuarioController.getById);
router.post('/', rolesMiddleware('ADMINISTRADOR'), usuarioValidator, validate, usuarioController.create);
router.put('/:id', rolesMiddleware('ADMINISTRADOR'), idParamValidator, usuarioUpdateValidator, validate, usuarioController.update);
router.delete('/:id', rolesMiddleware('ADMINISTRADOR'), idParamValidator, validate, usuarioController.remove);

export default router;
