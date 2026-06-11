import type { RequestHandler } from 'express';

// Light defence against obvious injection in free-text fields. Strips angle
// brackets and inline JS handlers before anything reaches the DB or the model.
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export const sanitizeRequestBody: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  next();
};
