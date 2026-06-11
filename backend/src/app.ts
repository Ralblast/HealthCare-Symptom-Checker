import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env.js';
import { sanitizeRequestBody } from './middleware/sanitize.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import checkerRoutes from './routes/checker.routes.js';
import metaRoutes from './routes/meta.routes.js';

const app = express();

app.use(helmet());

// The frontend runs on Vercel in prod and localhost in dev. Allow the
// configured origin plus any *.vercel.app preview deploy.
const allowedOrigins = [env.frontendUrl, 'http://localhost:5173'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(compression());
app.use(sanitizeRequestBody);
app.use('/api', apiRateLimiter);
app.use(requestLogger);

app.use('/api', metaRoutes);
app.use('/api', checkerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
