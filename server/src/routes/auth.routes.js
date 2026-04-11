import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authenticate, authCtrl.logout);
router.post('/refresh-token', authCtrl.refreshToken);
router.get('/me', authenticate, authCtrl.getMe);

export default router;
