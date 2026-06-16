import { Router } from "express";
import { cargoRouter } from "./cargo.routes.js";
import { clientRouter } from "./cliente.routes.js";
import { empleadoRouter } from "./empleado.routes.js";
import { usuarioRouter } from "./usuario.routes.js";
import { providerRouter } from "./proveedor.routes.js";

const apiRouter = Router();

apiRouter.use("/clientes", clientRouter);
apiRouter.use("/proveedores", providerRouter);
apiRouter.use("/cargos", cargoRouter);
apiRouter.use("/empleados", empleadoRouter);
apiRouter.use("/usuarios", usuarioRouter);

export { apiRouter };
