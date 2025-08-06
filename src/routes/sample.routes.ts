import { Router } from 'express';
import * as sampleController from '../controllers/sample.controllers';

const router = Router();

router.post('/', sampleController.addSample);
router.get('/agent/:agentId', sampleController.getAgentSamples);
router.patch('/:sampleId/collect', sampleController.markSampleAsCollected);

export default router;