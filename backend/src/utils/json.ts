import logger from './logger.js';

// LLMs occasionally wrap their JSON in ```json ... ``` fences or add a stray
// sentence before/after it, so we strip the fence and fall back to grabbing
// the first {...} block before parsing.
export function parseJsonResponse<T = unknown>(text: string): T | null {
  if (!text || typeof text !== 'string') return null;

  try {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) cleaned = match[0];

    return JSON.parse(cleaned) as T;
  } catch (err) {
    logger.warn('Could not parse JSON from AI response', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
