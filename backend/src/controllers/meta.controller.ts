import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '../config/constants.js';
import { env } from '../config/env.js';
import MedicalCondition from '../models/MedicalCondition.js';
import QueryHistory from '../models/QueryHistory.js';
import logger from '../utils/logger.js';

// Doubles as a DB ping — a cheap query that fails loudly if Mongo is down.
export const healthCheck: RequestHandler = async (_req, res) => {
  try {
    await MedicalCondition.findOne().lean().exec();
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
      database: 'connected',
    });
  } catch (err) {
    logger.error('Health check failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      success: false,
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
};

export const getStats: RequestHandler = async (_req, res, next) => {
  try {
    const [totalQueries, emergencyQueries, conditionsCount] = await Promise.all([
      QueryHistory.countDocuments(),
      QueryHistory.countDocuments({ isEmergency: true }),
      MedicalCondition.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { totalQueries, emergencyQueries, conditionsCount, timestamp: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
};

export const getConditions: RequestHandler = async (_req, res, next) => {
  try {
    const conditions = await MedicalCondition.find().select('-__v').sort({ condition: 1 }).lean();
    res.json({ success: true, count: conditions.length, data: conditions });
  } catch (err) {
    next(err);
  }
};

export const getHistory: RequestHandler = async (_req, res, next) => {
  try {
    // IP / user-agent are intentionally excluded — the Insights tab only ever
    // shows anonymised aggregates.
    const history = await QueryHistory.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v -ipAddress -userAgent')
      .lean();

    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    next(err);
  }
};
