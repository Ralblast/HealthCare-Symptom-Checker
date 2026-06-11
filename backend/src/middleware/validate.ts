import type { RequestHandler } from 'express';
import { HTTP_STATUS, VALIDATION_RULES } from '../config/constants.js';

const { SYMPTOM, CONTEXT } = VALIDATION_RULES;

export const validateSymptomInput: RequestHandler = (req, res, next) => {
  const { symptom } = req.body as { symptom?: unknown };

  if (typeof symptom !== 'string' || symptom.trim().length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Symptom is required',
      code: 'INVALID_INPUT',
    });
    return;
  }

  const trimmed = symptom.trim();

  if (trimmed.length < SYMPTOM.MIN_LENGTH) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: `Symptom must be at least ${SYMPTOM.MIN_LENGTH} characters`,
      code: 'INPUT_TOO_SHORT',
    });
    return;
  }

  if (trimmed.length > SYMPTOM.MAX_LENGTH) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: `Symptom must not exceed ${SYMPTOM.MAX_LENGTH} characters`,
      code: 'INPUT_TOO_LONG',
    });
    return;
  }

  req.sanitizedSymptom = trimmed;
  next();
};

export const validateAnalysisInput: RequestHandler = (req, res, next) => {
  const { fullContext } = req.body as { fullContext?: unknown };

  if (typeof fullContext !== 'string') {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Full context is required',
      code: 'INVALID_INPUT',
    });
    return;
  }

  const trimmed = fullContext.trim();

  if (trimmed.length < CONTEXT.MIN_LENGTH) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Context is too short. Please provide more details',
      code: 'CONTEXT_TOO_SHORT',
    });
    return;
  }

  if (trimmed.length > CONTEXT.MAX_LENGTH) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Context is too long. Please be more concise',
      code: 'CONTEXT_TOO_LONG',
    });
    return;
  }

  req.sanitizedContext = trimmed;
  next();
};
