import { Router } from 'express';
import {
  healthCheck,
  getStats,
  getConditions,
  getHistory,
} from '../controllers/meta.controller.js';

const router = Router();

router.get('/health', healthCheck);
router.get('/stats', getStats);
router.get('/conditions', getConditions);
router.get('/history', getHistory);

export default router;
