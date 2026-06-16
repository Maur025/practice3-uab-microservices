import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import sucursalRoutes from './sucursal.routes.js';
import cargoRoutes from './cargo.routes.js';
import empleadoRoutes from './empleado.routes.js';
import usuarioRoutes from './usuario.routes.js';
import rolRoutes from './rol.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/sucursales', sucursalRoutes);
router.use('/cargos', cargoRoutes);
router.use('/empleados', empleadoRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/roles', rolRoutes);

export default router;
