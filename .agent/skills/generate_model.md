---
name: Generate Mongoose Model
description: Generate a Mongoose model/schema file for a given entity
---

# Generate Mongoose Model

## When to Use
When you need to create a new database entity (collection) for the cafeteria system.

## Input Required
- **Entity name** (e.g., `Product`, `Order`, `User`)
- **Fields** with types, constraints, and relationships
- **Whether soft delete is needed** (default: yes for core entities)

## Steps

1. **Create the file** at `src/models/<entity-name>.model.js`.

2. **Define the schema** following this template:

```javascript
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const entitySchema = new Schema(
  {
    // Define fields here with types and validators
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    // Reference fields
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    // Enum fields
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
    // Soft delete fields (if applicable)
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
entitySchema.index({ name: 1 });
entitySchema.index({ status: 1 });

// Query middleware: exclude soft-deleted by default
entitySchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Plugins
entitySchema.plugin(mongoosePaginate);

// Virtuals (if needed)

// Instance methods (if needed)

// Static methods (if needed)

const Entity = mongoose.model('Entity', entitySchema);
export default Entity;
```

3. **Add indexes** on fields used for filtering, sorting, or lookups.

4. **Add pre-save hooks** if any field needs to be computed before saving.

5. **Export** the model as default export.

## Checklist
- [ ] File placed in `src/models/`
- [ ] `timestamps: true` enabled
- [ ] All required fields have validation messages
- [ ] Indexes added for query-heavy fields
- [ ] Soft delete middleware added (if applicable)
- [ ] Pagination plugin registered
- [ ] Model exported as default
