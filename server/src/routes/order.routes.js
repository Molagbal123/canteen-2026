import { Router } from 'express';
import * as orderCtrl from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

router.post('/', authenticate, orderCtrl.createOrder);
router.get('/my-orders', authenticate, orderCtrl.getUserOrders);

router.get('/all', authenticate, authorize('admin'), orderCtrl.getAllOrders);
router.get('/stats', authenticate, authorize('admin'), orderCtrl.getStats);
router.patch('/:id/status', authenticate, authorize('admin'), orderCtrl.updateOrderStatus);

export default router;
