export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const ERROR_MESSAGES = {
  INVALID_SYMPTOM: 'Please provide a valid symptom description (3-500 characters)',
  INVALID_CONTEXT: 'Please provide complete symptom context',
  EMERGENCY_DETECTED: 'Emergency symptoms detected. Seek immediate medical attention.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  AI_ERROR: 'Failed to process your request. Please try again.',
  DB_ERROR: 'Database operation failed'
};

export const EMERGENCY_KEYWORDS = [
  "chest pain", "can't breathe", "cannot breathe", "difficulty breathing",
  "severe chest pain", "crushing chest pain",
  "suicidal", "suicide", "kill myself", "end my life",
  "severe bleeding", "heavy bleeding", "bleeding won't stop",
  "slurred speech", "can't speak clearly", "face drooping",
  "numbness", "sudden numbness", "paralysis",
  "loss of vision", "sudden blindness", "can't see",
  "unconscious", "fainting", "passed out", "losing consciousness",
  "seizure", "convulsions", "shaking uncontrollably",
  "stroke", "heart attack", "cardiac arrest",
  "severe abdominal pain", "stabbing stomach pain",
  "coughing blood", "vomiting blood", "blood in stool",
  "severe head injury", "head trauma", "skull fracture",
  "choking", "can't swallow", "airway blocked",
  "anaphylaxis", "severe allergic reaction", "throat swelling",
  "overdose", "poisoning", "toxic ingestion"
];

export const VALIDATION_RULES = {
  SYMPTOM: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 500
  },
  CONTEXT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000
  }
};

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, 
  MAX_REQUESTS: 100,
  MESSAGE: 'Too many requests. Please try again later.'
};

export const AI_CONFIG = {
  MODEL: "llama-3.3-70b-versatile",
  TEMPERATURE: 0.7,
  MAX_TOKENS: {
    QUESTIONS: 512,
    ANALYSIS: 2048
  },
  RETRY_ATTEMPTS: 2,
  TIMEOUT: 30000 
};
