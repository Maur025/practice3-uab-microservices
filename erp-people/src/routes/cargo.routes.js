import { Router } from 'express';
import cargoController from '../controllers/cargo.controller.js';
import { authMiddleware, rolesMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamValidator, cargoValidator, cargoUpdateValidator } from '../validators/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', cargoController.getAll);
router.get('/:id', idParamValidator, validate, cargoController.getById);
router.post('/', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), cargoValidator, validate, cargoController.create);
router.put('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, cargoUpdateValidator, validate, cargoController.update);
router.delete('/:id', rolesMiddleware('ADMINISTRADOR', 'GERENTE'), idParamValidator, validate, cargoController.remove);

export default router;
