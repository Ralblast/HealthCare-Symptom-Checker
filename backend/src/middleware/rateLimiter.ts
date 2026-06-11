import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../config/constants.js';

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: { success: false, error: RATE_LIMIT.MESSAGE, code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});
