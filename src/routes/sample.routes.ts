import { Router } from 'express';
import * as sampleController from '../controllers/sample.controllers';
import { protect } from '../middlewares/auth.middlewares';

const router = Router();

router.post('/',protect, sampleController.addSample);
router.get('/agent/:agentId', protect, sampleController.getAgentSamples);
router.patch('/:sampleId/collect',protect, sampleController.markSampleAsCollected);

export default router;