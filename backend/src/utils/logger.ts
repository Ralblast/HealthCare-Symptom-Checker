import winston from 'winston';
import { env } from '../config/env.js';

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Human-readable lines for local dev; structured JSON goes to the log files.
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf((info) => {
    const { level, message, timestamp: ts, ...meta } = info;
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} ${level} ${message}${extra}`;
  }),
);

export const logger = winston.createLogger({
  level: env.logLevel,
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [],
});

if (env.isTest) {
  // Keep test output clean.
  logger.add(new winston.transports.Console({ silent: true }));
} else {
  logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
  if (!env.isProd) {
    logger.add(new winston.transports.Console({ format: devFormat }));
  }
}

export default logger;
