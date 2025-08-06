import { Router } from 'express';
import { registerAgent, loginAgent } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', registerAgent);

router.post('/login', loginAgent);

export default router;