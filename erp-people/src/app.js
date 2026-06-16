import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import swaggerSpec from './docs/swagger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import './models/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'ERP People API Docs',
}));

app.get('/health', (_req, res) => res.status(200).send('OK'));
app.use('/api/health', healthRoutes);
app.use('/api', routes);
app.use('/api/personas', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
