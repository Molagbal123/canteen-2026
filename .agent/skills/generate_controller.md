---
name: Generate Controller
description: Generate an Express controller with standard CRUD operations
---

# Generate Controller

## When to Use
When you need to create a controller for a new resource that handles HTTP requests and responses.

## Input Required
- **Resource name** (e.g., `product`, `order`)
- **Operations needed** (CRUD or custom actions)

## Steps

1. **Create the file** at `src/controllers/<resource>.controller.js`.

2. **Follow this template**:

```javascript
import { catchAsync } from '../utils/catch-async.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import * as resourceService from '../services/<resource>.service.js';

/**
 * @desc    Get all resources with pagination & filtering
 * @route   GET /api/v1/resources
 * @access  Public or Private (specify)
 */
export const getAll = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, sort, order, ...filters } = req.query;
  const result = await resourceService.getAll({ page, limit, sort, order, filters });

  res.status(200).json({
    success: true,
    data: result.docs,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.totalDocs,
      totalPages: result.totalPages,
    },
  });
});

/**
 * @desc    Get single resource by ID
 * @route   GET /api/v1/resources/:id
 * @access  Public or Private
 */
export const getById = catchAsync(async (req, res) => {
  const resource = await resourceService.getById(req.params.id);
  if (!resource) throw new NotFoundError('Resource');

  res.status(200).json({ success: true, data: resource });
});

/**
 * @desc    Create a new resource
 * @route   POST /api/v1/resources
 * @access  Private
 */
export const create = catchAsync(async (req, res) => {
  const resource = await resourceService.create(req.body);

  res.status(201).json({
    success: true,
    data: resource,
    message: 'Resource created successfully',
  });
});

/**
 * @desc    Update a resource
 * @route   PUT /api/v1/resources/:id
 * @access  Private
 */
export const update = catchAsync(async (req, res) => {
  const resource = await resourceService.update(req.params.id, req.body);
  if (!resource) throw new NotFoundError('Resource');

  res.status(200).json({
    success: true,
    data: resource,
    message: 'Resource updated successfully',
  });
});

/**
 * @desc    Delete a resource (soft delete)
 * @route   DELETE /api/v1/resources/:id
 * @access  Private/Admin
 */
export const remove = catchAsync(async (req, res) => {
  const resource = await resourceService.remove(req.params.id);
  if (!resource) throw new NotFoundError('Resource');

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully',
  });
});
```

3. **Rules**:
   - Controllers must be **thin** — no business logic, no direct DB calls.
   - Use `catchAsync` on every handler.
   - Validate input using middleware or at the start of the handler.
   - Return consistent response structure (`success`, `data`, `message`).
   - Include JSDoc comments with `@desc`, `@route`, `@access`.

## Checklist
- [ ] File placed in `src/controllers/`
- [ ] All handlers wrapped with `catchAsync`
- [ ] Delegates to service layer
- [ ] Uses standard response format
- [ ] Has JSDoc on every exported function
- [ ] No business logic in the controller
