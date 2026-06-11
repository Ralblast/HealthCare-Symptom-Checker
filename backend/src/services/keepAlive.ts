import MedicalCondition from '../models/MedicalCondition.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

// Free-tier Atlas clusters pause after about 60 days with no activity, which
// breaks the live demo. This runs a tiny query every so often to keep ours
// warm while the server is up. Set KEEP_ALIVE_HOURS=0 to turn it off.
export function startKeepAlive(): void {
  const hours = env.keepAliveHours;
  if (!hours || hours <= 0) return;

  const ping = async () => {
    try {
      const count = await MedicalCondition.estimatedDocumentCount();
      logger.info('Keep-alive ping ok', { conditions: count });
    } catch (err) {
      logger.warn('Keep-alive ping failed', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const timer = setInterval(ping, hours * 60 * 60 * 1000);
  timer.unref(); // don't keep the process alive just for the ping
  logger.info('Keep-alive scheduled', { everyHours: hours });
}
