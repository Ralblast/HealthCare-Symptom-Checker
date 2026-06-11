import type { RequestHandler } from 'express';
import { ERROR_MESSAGES } from '../config/constants.js';
import { generateClarificationQuestions, analyzeSymptoms } from '../services/ai.service.js';
import { isEmergency, findMatchingConditions } from '../services/condition.service.js';
import QueryHistory from '../models/QueryHistory.js';
import logger from '../utils/logger.js';

// Step 1 of the flow: emergency triage, otherwise ask follow-up questions.
export const startCheck: RequestHandler = async (req, res, next) => {
  try {
    const symptom = req.sanitizedSymptom!;
    const symptomLower = symptom.toLowerCase();

    if (isEmergency(symptomLower)) {
      logger.warn('Emergency symptoms detected', { symptom: symptomLower });

      await QueryHistory.create({
        symptom: symptomLower,
        isEmergency: true,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      res.json({ success: true, isEmergency: true, message: ERROR_MESSAGES.EMERGENCY_DETECTED });
      return;
    }

    const questions = await generateClarificationQuestions(symptom);
    logger.info('Questions generated', { count: questions.length });
    res.json({ success: true, questions });
  } catch (err) {
    next(err);
  }
};

// Step 2: match against the knowledge base, run the analysis, store the result.
export const analyze: RequestHandler = async (req, res, next) => {
  try {
    const context = req.sanitizedContext!;

    const matchingConditions = await findMatchingConditions(context);
    const analysis = await analyzeSymptoms(context, matchingConditions);

    await QueryHistory.create({
      symptom: context,
      analysisResult: analysis,
      isEmergency: false,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info('Analysis completed successfully');
    res.json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
};
