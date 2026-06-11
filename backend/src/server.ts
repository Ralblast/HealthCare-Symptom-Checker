import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedMedicalData } from './services/seed.service.js';
import logger from './utils/logger.js';

async function start(): Promise<void> {
  try {
    logger.info('Starting Healthcare Symptom Checker API...');
    await connectDB();
    await seedMedicalData();

    app.listen(env.port, () => {
      logger.info('Server started', {
        port: env.port,
        environment: env.nodeEnv,
        url: `http://localhost:${env.port}`,
      });
    });
  } catch (err) {
    logger.error('Failed to start server', {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exit(1);
  }
}

function shutdown(signal: string): void {
  logger.info(`${signal} received, shutting down`);
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
  process.exit(1);
});

void start();
