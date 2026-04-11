import { Router } from 'express';
import * as foodCtrl from '../controllers/food.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/categories', foodCtrl.getCategories);

router
  .route('/')
  .get(foodCtrl.getAll)
  .post(
    authenticate,
    authorize('admin'),
    upload.single('image'),
    foodCtrl.create
  );

router
  .route('/:id')
  .get(foodCtrl.getById)
  .put(
    authenticate,
    authorize('admin'),
    upload.single('image'),
    foodCtrl.update
  )
  .delete(
    authenticate,
    authorize('admin'),
    foodCtrl.remove
  );

export default router;
