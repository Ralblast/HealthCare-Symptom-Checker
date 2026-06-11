// Status codes we actually return from this API.
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  EMERGENCY_DETECTED: 'Emergency symptoms detected. Seek immediate medical attention.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  AI_ERROR: 'Failed to process your request. Please try again.',
} as const;

// Keywords that should skip the AI flow and go straight to an emergency notice.
// Kept deliberately broad — a false positive here just shows a "call emergency"
// screen, which is the safe failure mode for a symptom checker.
export const EMERGENCY_KEYWORDS = [
  'chest pain', "can't breathe", 'cannot breathe', 'difficulty breathing',
  'severe chest pain', 'crushing chest pain',
  'suicidal', 'suicide', 'kill myself', 'end my life',
  'severe bleeding', 'heavy bleeding', "bleeding won't stop",
  'slurred speech', "can't speak clearly", 'face drooping',
  'numbness', 'sudden numbness', 'paralysis',
  'loss of vision', 'sudden blindness', "can't see",
  'unconscious', 'fainting', 'passed out', 'losing consciousness',
  'seizure', 'convulsions', 'shaking uncontrollably',
  'stroke', 'heart attack', 'cardiac arrest',
  'severe abdominal pain', 'stabbing stomach pain',
  'coughing blood', 'vomiting blood', 'blood in stool',
  'severe head injury', 'head trauma', 'skull fracture',
  'choking', "can't swallow", 'airway blocked',
  'anaphylaxis', 'severe allergic reaction', 'throat swelling',
  'overdose', 'poisoning', 'toxic ingestion',
];

export const VALIDATION_RULES = {
  SYMPTOM: { MIN_LENGTH: 3, MAX_LENGTH: 500 },
  CONTEXT: { MIN_LENGTH: 10, MAX_LENGTH: 2000 },
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100,
  MESSAGE: 'Too many requests. Please try again later.',
} as const;

export const AI_CONFIG = {
  MODEL: 'llama-3.3-70b-versatile',
  TEMPERATURE: 0.7,
  MAX_TOKENS: { QUESTIONS: 512, ANALYSIS: 2048 },
  RETRY_ATTEMPTS: 2,
} as const;

export const DISCLAIMER =
  '⚠️ This is educational information only, not medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment.';
