import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import { AI_CONFIG, DISCLAIMER } from '../config/constants.js';
import { parseJsonResponse } from '../utils/json.js';
import { retryWithBackoff } from '../utils/retry.js';
import logger from '../utils/logger.js';
import type { IMedicalCondition } from '../models/MedicalCondition.js';
import type { SymptomAnalysis, UrgencyLevel } from '../types/index.js';

const groq = new Groq({ apiKey: env.groqApiKey });

const URGENCY_LEVELS: UrgencyLevel[] = ['low', 'medium', 'high'];

const FALLBACK_QUESTIONS = [
  'How long have you been experiencing this symptom?',
  'On a scale of 1-10, how severe is it?',
  'Do you have any other symptoms along with this?',
];

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// Ask the model for three short follow-up questions. If anything goes wrong we
// fall back to generic ones so the user flow never dead-ends.
export async function generateClarificationQuestions(symptom: string): Promise<string[]> {
  const prompt = `You are a medical assistant. A patient reports: "${symptom}"

Generate 3 essential clarifying questions to better understand their condition.
Focus on: duration, severity, associated symptoms, and relevant history.

Respond with ONLY valid JSON (no markdown, no explanations):
{"questions": ["question 1", "question 2", "question 3"]}`;

  try {
    const completion = await retryWithBackoff(
      () =>
        groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: AI_CONFIG.MODEL,
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS.QUESTIONS,
        }),
      AI_CONFIG.RETRY_ATTEMPTS,
    );

    const text = completion.choices[0]?.message?.content ?? '';
    const parsed = parseJsonResponse<{ questions?: unknown }>(text);

    if (!parsed || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format from AI');
    }

    logger.info('Generated clarification questions', { count: parsed.questions.length });
    return (parsed.questions as string[]).slice(0, 3);
  } catch (err) {
    logger.error('Question generation failed, using fallback', { error: errorMessage(err) });
    return FALLBACK_QUESTIONS;
  }
}

// Analyse the symptom context, grounded on the conditions we pulled from the DB
// so the model can't invent diagnoses outside our knowledge base.
export async function analyzeSymptoms(
  symptomContext: string,
  matchingConditions: IMedicalCondition[],
): Promise<SymptomAnalysis> {
  const conditionsContext = matchingConditions
    .map(
      (cond, idx) =>
        `[Condition ${idx + 1}]
Name: ${cond.condition}
Symptoms: ${cond.symptoms.join(', ')}
Description: ${cond.description}
Source: ${cond.source}
Severity: ${cond.severity}`,
    )
    .join('\n\n');

  const prompt = `You are a medical AI assistant. Analyze the patient's symptoms against trusted medical information.

[PATIENT SYMPTOMS]
${symptomContext}

[MEDICAL KNOWLEDGE BASE]
${conditionsContext || 'No matching conditions found in database.'}

Based ONLY on the conditions above, provide analysis in this EXACT JSON format (no markdown):
{
  "potentialConditions": [
    {
      "conditionName": "exact name from knowledge base",
      "matchPercentage": 85,
      "reasoning": "why this matches the symptoms",
      "recommendations": ["recommendation 1", "recommendation 2"],
      "source": "source from knowledge base"
    }
  ],
  "summary": "brief summary and next steps",
  "urgencyLevel": "low"
}

CRITICAL RULES:
- Only suggest conditions from the knowledge base provided above
- If no knowledge base conditions match, suggest consulting a doctor
- Be honest if you cannot determine a specific condition
- Always emphasize consulting a healthcare professional
- urgencyLevel must be exactly one of: low, medium, high
- Respond with PURE JSON only - no markdown, no code blocks, start with { and end with }`;

  try {
    const completion = await retryWithBackoff(
      () =>
        groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: AI_CONFIG.MODEL,
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS.ANALYSIS,
        }),
      AI_CONFIG.RETRY_ATTEMPTS,
    );

    const text = completion.choices[0]?.message?.content ?? '';
    const analysis = parseJsonResponse<SymptomAnalysis>(text);

    if (!analysis) {
      throw new Error('Failed to parse AI response');
    }

    // Models sometimes return an urgency outside our enum — clamp to "medium".
    if (!URGENCY_LEVELS.includes(analysis.urgencyLevel)) {
      analysis.urgencyLevel = 'medium';
    }
    analysis.disclaimer = DISCLAIMER;

    logger.info('Analysis completed', {
      conditionsFound: analysis.potentialConditions?.length ?? 0,
      urgency: analysis.urgencyLevel,
    });

    return analysis;
  } catch (err) {
    logger.error('Symptom analysis failed, returning fallback', { error: errorMessage(err) });

    return {
      potentialConditions: [],
      summary:
        'Unable to complete analysis due to a technical issue. Please consult a healthcare professional for proper evaluation of your symptoms.',
      urgencyLevel: 'medium',
      disclaimer: DISCLAIMER,
    };
  }
}
