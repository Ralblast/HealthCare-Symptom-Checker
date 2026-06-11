import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  const conn = await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected', {
    host: conn.connection.host,
    database: conn.connection.name,
  });
}
