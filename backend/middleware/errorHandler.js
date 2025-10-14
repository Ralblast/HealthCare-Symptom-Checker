import { HTTP_STATUS } from '../config/constants.js';


export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
 
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message),
      code: 'VALIDATION_ERROR'
    });
  }
  

  if (err.code === 11000) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Duplicate entry',
      code: 'DUPLICATE_ERROR'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
  
 
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};


export const notFoundHandler = (req, res) => {
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
      'GET /api/history'
    ]
  });
};
