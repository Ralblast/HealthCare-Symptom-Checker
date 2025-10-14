import { HTTP_STATUS, ERROR_MESSAGES, VALIDATION_RULES } from '../config/constants.js';


export const validateSymptomInput = (req, res, next) => {
  const { symptom } = req.body;
  
  if (!symptom || typeof symptom !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: 'Symptom is required and must be a string',
      code: 'INVALID_INPUT_TYPE'
    });
  }
  
  const trimmedSymptom = symptom.trim();
  
  if (trimmedSymptom.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: 'Symptom cannot be empty',
      code: 'EMPTY_INPUT'
    });
  }
  
  if (trimmedSymptom.length < VALIDATION_RULES.SYMPTOM.MIN_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: `Symptom must be at least ${VALIDATION_RULES.SYMPTOM.MIN_LENGTH} characters`,
      code: 'INPUT_TOO_SHORT'
    });
  }
  
  if (trimmedSymptom.length > VALIDATION_RULES.SYMPTOM.MAX_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: `Symptom must not exceed ${VALIDATION_RULES.SYMPTOM.MAX_LENGTH} characters`,
      code: 'INPUT_TOO_LONG'
    });
  }
  

  req.sanitizedSymptom = trimmedSymptom;
  next();
};


export const validateAnalysisInput = (req, res, next) => {
  const { fullContext } = req.body;
  
  if (!fullContext || typeof fullContext !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: 'Full context is required and must be a string',
      code: 'INVALID_INPUT_TYPE'
    });
  }
  
  const trimmedContext = fullContext.trim();
  
  if (trimmedContext.length < VALIDATION_RULES.CONTEXT.MIN_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: 'Context is too short. Please provide more details',
      code: 'CONTEXT_TOO_SHORT'
    });
  }
  
  if (trimmedContext.length > VALIDATION_RULES.CONTEXT.MAX_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      success: false,
      error: 'Context is too long. Please be more concise',
      code: 'CONTEXT_TOO_LONG'
    });
  }
  
  req.sanitizedContext = trimmedContext;
  next();
};
