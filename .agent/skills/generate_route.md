---
name: Generate Route
description: Generate an Express route file with middleware and controller bindings
---

# Generate Route

## When to Use
When you need to define API endpoints for a new resource and wire them to controllers with appropriate middleware.

## Input Required
- **Resource name** (e.g., `product`, `order`)
- **Endpoints** and their access levels (public, authenticated, admin)
- **Custom middleware** (validation, file upload, etc.)

## Steps

1. **Create the file** at `src/routes/<resource>.routes.js`.

2. **Follow this template**:

```javascript
import { Router } from 'express';
import * as controller from '../controllers/<resource>.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createSchema,
  updateSchema,
} from '../validators/<resource>.validator.js';

const router = Router();

router
  .route('/')
  .get(controller.getAll)
  .post(
    authenticate,
    authorize('admin', 'staff'),
    validate(createSchema),
    controller.create
  );

router
  .route('/:id')
  .get(controller.getById)
  .put(
    authenticate,
    authorize('admin', 'staff'),
    validate(updateSchema),
    controller.update
  )
  .delete(
    authenticate,
    authorize('admin'),
    controller.remove
  );

export default router;
```

3. **Register the route** in `src/routes/index.js`:

```javascript
import resourceRoutes from './<resource>.routes.js';
router.use('/<resources>', resourceRoutes);
```

4. **Middleware order** on protected routes:
   1. `authenticate` — verify JWT
   2. `authorize(roles)` — check user role
   3. `validate(schema)` — validate request body
   4. Controller handler

5. **Rules**:
   - Group routes using `router.route()` for the same path.
   - Use `Router()` from Express — one router per resource.
   - Public routes (e.g., listing products) do not need `authenticate`.
   - Destructive operations (DELETE) should require `admin` role.
   - Always add input validation middleware before controller.

## Checklist
- [ ] File placed in `src/routes/`
- [ ] Route registered in `src/routes/index.js`
- [ ] Correct middleware order (auth → role → validate → handler)
- [ ] Public vs protected routes clearly separated
- [ ] Grouped routes with `router.route()`
- [ ] Validation schemas referenced
