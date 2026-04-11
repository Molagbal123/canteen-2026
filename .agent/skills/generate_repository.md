---
name: Generate Repository
description: Generate a repository layer file for database operations on a resource
---

# Generate Repository

## When to Use
When you need a data access layer that encapsulates all MongoDB/Mongoose queries for a resource.

## Input Required
- **Resource name** (e.g., `product`, `order`)
- **Model name** (PascalCase version of resource)
- **Custom queries** needed beyond standard CRUD

## Steps

1. **Create the file** at `src/repositories/<resource>.repository.js`.

2. **Follow this template**:

```javascript
import Model from '../models/<resource>.model.js';

/**
 * Find all documents with pagination
 * @param {Object} query - MongoDB filter query
 * @param {Object} options - Pagination options { page, limit, sort }
 */
export const findAll = async (query = {}, options = {}) => {
  return Model.paginate(query, {
    ...options,
    lean: true,
  });
};

/**
 * Find a single document by ID
 * @param {string} id - Document ObjectId
 * @param {string} [populate] - Fields to populate
 */
export const findById = async (id, populate = '') => {
  const query = Model.findById(id);
  if (populate) query.populate(populate);
  return query.lean();
};

/**
 * Find a single document by custom conditions
 * @param {Object} conditions - Query conditions
 */
export const findOne = async (conditions) => {
  return Model.findOne(conditions).lean();
};

/**
 * Create a new document
 * @param {Object} data - Document data
 */
export const create = async (data) => {
  const doc = new Model(data);
  return doc.save();
};

/**
 * Update a document by ID
 * @param {string} id - Document ObjectId
 * @param {Object} data - Fields to update
 */
export const update = async (id, data) => {
  return Model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Soft delete a document by ID
 * @param {string} id - Document ObjectId
 */
export const softDelete = async (id) => {
  return Model.findByIdAndUpdate(id, {
    isDeleted: true,
    deletedAt: new Date(),
  });
};

/**
 * Hard delete a document by ID (use sparingly)
 * @param {string} id - Document ObjectId
 */
export const hardDelete = async (id) => {
  return Model.findByIdAndDelete(id);
};

/**
 * Count documents matching a query
 * @param {Object} query - Query conditions
 */
export const count = async (query = {}) => {
  return Model.countDocuments(query);
};
```

3. **Rules**:
   - Only import the **Model** — no service or controller imports.
   - Use `.lean()` for read queries to improve performance.
   - Always use `runValidators: true` for updates.
   - Return raw Mongoose results — let the service layer interpret them.
   - Add custom query methods as needed (e.g., `findByCategory`, `findByStatus`).

## Checklist
- [ ] File placed in `src/repositories/`
- [ ] Imports only the Model
- [ ] Standard CRUD methods included
- [ ] Uses `.lean()` for read queries
- [ ] `runValidators: true` on updates
- [ ] Soft delete method included
- [ ] JSDoc on all exported functions
