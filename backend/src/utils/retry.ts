import logger from './logger.js';

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Retries a promise-returning function with exponential backoff. Used for the
// Groq calls, which occasionally rate-limit or hiccup.
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 2,
  baseDelay = 1000,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts) break;

      const delay = baseDelay * 2 ** (attempt - 1);
      logger.warn(`Retry ${attempt}/${maxAttempts} after ${delay}ms`, {
        error: err instanceof Error ? err.message : String(err),
      });
      await sleep(delay);
    }
  }

  throw lastError;
}
