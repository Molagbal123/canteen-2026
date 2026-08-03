import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

router.post('/register', authLimiter, authCtrl.register);
router.post('/login', authLimiter, authCtrl.login);
router.post('/logout', authenticate, authCtrl.logout);
router.post('/refresh-token', authCtrl.refreshToken);
router.get('/me', authenticate, authCtrl.getMe);

export default router;
