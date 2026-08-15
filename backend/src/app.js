import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import config from './config/env.js';
import { swaggerDocument } from './config/swagger.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// 1. Helmet (Disable CSP to allow Swagger UI stylesheets and inline scripts to render correctly)
app.use(helmet({
  contentSecurityPolicy: false
}));

// 2. CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// 3. Compression
app.use(compression());

// 4. JSON parser
app.use(express.json({ limit: '10mb' }));

// 5. URL-encoded parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Swagger API Documentation Page (OpenAPI 3.0 UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 7. Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
max: 100, // Increased limit for local development/testing to avoid blocking
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// 7. Request logger
app.use(requestLogger);

// 8. Routes
app.use('/api', apiRoutes);

// 9. Not found middleware
app.use(notFoundHandler);

// 10. Error middleware
app.use(errorHandler);

export default app;
