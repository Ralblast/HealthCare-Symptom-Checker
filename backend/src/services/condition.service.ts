import { MedicalCondition, type IMedicalCondition } from '../models/MedicalCondition.js';
import { EMERGENCY_KEYWORDS } from '../config/constants.js';
import logger from '../utils/logger.js';

// --- pure helpers (unit-tested without a DB) ---

export function isEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

export function matchByKeywords<T extends { symptoms: string[] }>(
  conditions: T[],
  keywords: string[],
): T[] {
  return conditions.filter((condition) =>
    condition.symptoms.some((symptom) =>
      keywords.some((keyword) => symptom.includes(keyword) || keyword.includes(symptom)),
    ),
  );
}

// --- DB-backed lookup ---

// Try MongoDB's text index first; if it finds nothing (e.g. very short or
// unusual input) fall back to a simple keyword overlap against every condition.
export async function findMatchingConditions(context: string): Promise<IMedicalCondition[]> {
  const search = context.toLowerCase();

  let matches = await MedicalCondition.find(
    { $text: { $search: search } },
    { score: { $meta: 'textScore' } },
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .lean();

  if (matches.length === 0) {
    const all = await MedicalCondition.find().lean();
    matches = matchByKeywords(all, extractKeywords(search));
  }

  logger.info('Conditions matched', { count: matches.length });
  return matches;
}
