import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HTTP_STATUS } from '../config/constants.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

interface AppError extends Error {
  statusCode?: number;
  code?: string | number;
  errors?: Record<string, { message: string }>;
}

export const errorHandler: ErrorRequestHandler = (err: AppError, req, res, _next) => {
  logger.error('Request error', {
    message: err.message,
    path: req.path,
    method: req.method,
  });

  // Mongoose schema validation
  if (err.name === 'ValidationError' && err.errors) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => e.message),
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Duplicate entry',
      code: 'DUPLICATE_ERROR',
    });
    return;
  }

  const status = err.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    code: typeof err.code === 'string' ? err.code : 'INTERNAL_ERROR',
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.path,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/start-check',
      'POST /api/analyze',
      'GET /api/conditions',
      'GET /api/history',
      'GET /api/stats',
    ],
  });
};
