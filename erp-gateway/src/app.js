import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import routes from './routes/index.js';
import swaggerSpec from './docs/swagger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { configServices } from './config-services.js';

const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'ERP Gateway API Docs',
}));

app.use('/api', routes);

Object.entries(configServices).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: async (pathStr, req) => req.originalUrl,
      on: {
        proxyReq: fixRequestBody,
      },
    }),
  );
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
