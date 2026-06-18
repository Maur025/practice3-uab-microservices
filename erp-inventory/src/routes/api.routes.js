import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  idParamValidator, categoriaValidator, categoriaUpdateValidator,
  unidadValidator, unidadUpdateValidator,
  productoValidator, productoUpdateValidator,
  inventarioValidator, inventarioUpdateValidator,
  movimientoValidator, stockInicialValidator, transferenciaValidator,
  sucursalQueryValidator, loteValidator,
} from "../validators/index.js";
import { getCategorias, getCategoria, postCategoria, putCategoria, removeCategoria } from "../controllers/categoria.controller.js";
import { getUnidades, getUnidad, postUnidad, putUnidad, removeUnidad } from "../controllers/unidad.controller.js";
import { getProducts, getProduct, postProduct, putProduct, removeProduct } from "../controllers/product.controller.js";
import {
  getInventarios, getInventario, postInventario, putInventario, removeInventario,
  postInicializarStock, postTransferirStock, getReporteStock, getReporteStockPdf,
  getLotes, getLote, postLote,
} from "../controllers/inventory.controller.js";
import { getMovimientos, getMovimiento, postMovimiento } from "../controllers/movement.controller.js";

const apiRouter = Router();

apiRouter.get("/catalogo/categorias", getCategorias);
apiRouter.get("/catalogo/categorias/:id", idParamValidator, validate, getCategoria);
apiRouter.post("/catalogo/categorias", categoriaValidator, validate, postCategoria);
apiRouter.put("/catalogo/categorias/:id", idParamValidator, categoriaUpdateValidator, validate, putCategoria);
apiRouter.delete("/catalogo/categorias/:id", idParamValidator, validate, removeCategoria);

apiRouter.get("/catalogo/unidades", getUnidades);
apiRouter.get("/catalogo/unidades/:id", idParamValidator, validate, getUnidad);
apiRouter.post("/catalogo/unidades", unidadValidator, validate, postUnidad);
apiRouter.put("/catalogo/unidades/:id", idParamValidator, unidadUpdateValidator, validate, putUnidad);
apiRouter.delete("/catalogo/unidades/:id", idParamValidator, validate, removeUnidad);

apiRouter.get("/catalogo/productos", getProducts);
apiRouter.get("/catalogo/productos/:id", idParamValidator, validate, getProduct);
apiRouter.post("/catalogo/productos", productoValidator, validate, postProduct);
apiRouter.put("/catalogo/productos/:id", idParamValidator, productoUpdateValidator, validate, putProduct);
apiRouter.delete("/catalogo/productos/:id", idParamValidator, validate, removeProduct);

apiRouter.get("/stock", getInventarios);
apiRouter.get("/stock/reporte/pdf", sucursalQueryValidator, validate, getReporteStockPdf);
apiRouter.get("/stock/reporte", sucursalQueryValidator, validate, getReporteStock);
apiRouter.post("/stock/inicializar", stockInicialValidator, validate, postInicializarStock);
apiRouter.post("/stock/transferir", transferenciaValidator, validate, postTransferirStock);
apiRouter.get("/stock/:id", idParamValidator, validate, getInventario);
apiRouter.post("/stock", inventarioValidator, validate, postInventario);
apiRouter.put("/stock/:id", idParamValidator, inventarioUpdateValidator, validate, putInventario);
apiRouter.delete("/stock/:id", idParamValidator, validate, removeInventario);

apiRouter.get("/movimientos", getMovimientos);
apiRouter.get("/movimientos/:id", idParamValidator, validate, getMovimiento);
apiRouter.post("/movimientos", movimientoValidator, validate, postMovimiento);

apiRouter.get("/lotes", getLotes);
apiRouter.get("/lotes/:id", idParamValidator, validate, getLote);
apiRouter.post("/lotes", loteValidator, validate, postLote);

export { apiRouter };
