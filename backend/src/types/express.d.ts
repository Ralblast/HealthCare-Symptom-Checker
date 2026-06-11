import 'express';

// Validators stash the cleaned input here so controllers read trusted values.
declare global {
  namespace Express {
    interface Request {
      sanitizedSymptom?: string;
      sanitizedContext?: string;
    }
  }
}
