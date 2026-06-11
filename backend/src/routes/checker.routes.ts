import { Router, type RequestHandler } from 'express';
import timeout from 'connect-timeout';
import { startCheck, analyze } from '../controllers/checker.controller.js';
import { validateSymptomInput, validateAnalysisInput } from '../middleware/validate.js';

const router = Router();

// connect-timeout keeps a request flagged after it times out; this guard stops
// the chain so we don't try to respond twice.
const haltOnTimedout: RequestHandler = (req, _res, next) => {
  if (!req.timedout) next();
};

router.post('/start-check', timeout('60s'), haltOnTimedout, validateSymptomInput, startCheck);
router.post('/analyze', timeout('60s'), haltOnTimedout, validateAnalysisInput, analyze);

export default router;
