---
name: Generate Service
description: Generate a service layer file containing business logic for a resource
---

# Generate Service

## When to Use
When you need a service to encapsulate business logic between the controller and repository layers.

## Input Required
- **Resource name** (e.g., `product`, `order`)
- **Business rules** specific to this resource

## Steps

1. **Create the file** at `src/services/<resource>.service.js`.

2. **Follow this template**:

```javascript
import * as resourceRepo from '../repositories/<resource>.repository.js';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors.js';

/**
 * Get all resources with pagination and filters
 */
export const getAll = async ({ page, limit, sort, order, filters }) => {
  const query = buildFilterQuery(filters);
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort ? { [sort]: order === 'desc' ? -1 : 1 } : { createdAt: -1 },
  };
  return resourceRepo.findAll(query, options);
};

/**
 * Get a single resource by ID
 */
export const getById = async (id) => {
  const resource = await resourceRepo.findById(id);
  if (!resource) throw new NotFoundError('Resource');
  return resource;
};

/**
 * Create a new resource
 */
export const create = async (data) => {
  // Add business validation here
  // e.g., check for duplicates, validate relationships
  return resourceRepo.create(data);
};

/**
 * Update a resource by ID
 */
export const update = async (id, data) => {
  const existing = await resourceRepo.findById(id);
  if (!existing) throw new NotFoundError('Resource');

  // Add business rules for updates here
  return resourceRepo.update(id, data);
};

/**
 * Soft delete a resource by ID
 */
export const remove = async (id) => {
  const existing = await resourceRepo.findById(id);
  if (!existing) throw new NotFoundError('Resource');

  return resourceRepo.softDelete(id);
};

/**
 * Build a MongoDB filter query from request query params
 */
const buildFilterQuery = (filters) => {
  const query = {};
  // Map filter params to query conditions
  // Example: if (filters.category) query.category = filters.category;
  // Example: if (filters.search) query.name = { $regex: filters.search, $options: 'i' };
  return query;
};
```

3. **Rules**:
   - All business logic lives here (validation, computed fields, access checks).
   - Throw appropriate `AppError` subclasses for error conditions.
   - Call repository methods for data access — never import models directly.
   - Keep functions pure where possible; avoid side effects unrelated to the task.
   - Each function should do **one thing** clearly.

## Checklist
- [ ] File placed in `src/services/`
- [ ] Business logic separated from data access
- [ ] Throws appropriate custom errors
- [ ] Delegates database operations to repository
- [ ] JSDoc on all exported functions
- [ ] Filter/query building is encapsulated
