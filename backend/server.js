import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/database.js';
import { HTTP_STATUS, ERROR_MESSAGES, EMERGENCY_KEYWORDS, RATE_LIMIT } from './config/constants.js';
import { seedMedicalData } from './services/seedDatabase.js';
import MedicalCondition from './models/MedicalCondition.js';
import QueryHistory from './models/QueryHistory.js';
import { generateClarificationQuestions, analyzeSymptoms } from './services/aiService.js';
import { validateSymptomInput, validateAnalysisInput } from './middleware/validation.js';
import { sanitizeRequestBody } from './middleware/sanitization.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://health-care-symptom-checker-seven.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(compression());

app.use(sanitizeRequestBody);

const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: { success: false, error: RATE_LIMIT.MESSAGE, code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected'
  });
});

app.post('/api/start-check', validateSymptomInput, async (req, res, next) => {
  try {
    const symptom = req.sanitizedSymptom;
    const symptomLower = symptom.toLowerCase();
    
    const isEmergency = EMERGENCY_KEYWORDS.some(keyword => 
      symptomLower.includes(keyword.toLowerCase())
    );
    
    if (isEmergency) {
      logger.warn('Emergency symptoms detected', { symptom: symptomLower });
      
      await QueryHistory.create({
        symptom: symptomLower,
        isEmergency: true,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      return res.json({ 
        success: true,
        isEmergency: true,
        message: ERROR_MESSAGES.EMERGENCY_DETECTED
      });
    }
    
    const questions = await generateClarificationQuestions(symptom);
    
    logger.info('Questions generated', { count: questions.length });
    
    res.json({ 
      success: true,
      questions 
    });

  } catch (error) {
    logger.error('Error in start-check', error);
    next(error);
  }
});

app.post('/api/analyze', validateAnalysisInput, async (req, res, next) => {
  try {
    const fullContext = req.sanitizedContext;
    const contextLower = fullContext.toLowerCase();

    let matchingConditions = await MedicalCondition.find(
      { $text: { $search: contextLower } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(5)
    .lean();

    if (matchingConditions.length === 0) {
      const allConditions = await MedicalCondition.find().lean();
      const keywords = contextLower.split(' ').filter(word => word.length > 3);
      
      matchingConditions = allConditions.filter(condition => 
        condition.symptoms.some(symptom => 
          keywords.some(keyword => 
            symptom.includes(keyword) || keyword.includes(symptom)
          )
        )
      );
    }

    logger.info('Conditions matched', { count: matchingConditions.length });

    const analysis = await analyzeSymptoms(fullContext, matchingConditions);

    await QueryHistory.create({
      symptom: fullContext,
      analysisResult: analysis,
      isEmergency: false,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info('Analysis completed successfully');

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    logger.error('Error in analyze', error);
    next(error);
  }
});

app.get('/api/conditions', async (req, res, next) => {
  try {
    const conditions = await MedicalCondition.find()
      .select('-__v')
      .sort({ condition: 1 })
      .lean();
    
    res.json({ 
      success: true,
      count: conditions.length,
      data: conditions 
    });
  } catch (error) {
    logger.error('Error fetching conditions', error);
    next(error);
  }
});

app.get('/api/history', async (req, res, next) => {
  try {
    const history = await QueryHistory.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v -ipAddress -userAgent')
      .lean();
    
    res.json({ 
      success: true,
      count: history.length,
      data: history 
    });
  } catch (error) {
    logger.error('Error fetching history', error);
    next(error);
  }
});

app.get('/api/stats', async (req, res, next) => {
  try {
    const [totalQueries, emergencyQueries, conditionsCount] = await Promise.all([
      QueryHistory.countDocuments(),
      QueryHistory.countDocuments({ isEmergency: true }),
      MedicalCondition.countDocuments()
    ]);
    
    res.json({
      success: true,
      data: {
        totalQueries,
        emergencyQueries,
        conditionsCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching stats', error);
    next(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

(async () => {
  try {
    logger.info('Starting Healthcare Symptom Checker API...');
    
    await connectDB();

    await seedMedicalData();
  
    app.listen(PORT, () => {
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        url: `http://localhost:${PORT}`
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
})();

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, closing server gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});
