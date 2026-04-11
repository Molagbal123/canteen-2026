---
description: Step-by-step workflow for database schema migrations and changes
---

# Database Migration Workflow

## Overview
Use this workflow when modifying existing Mongoose schemas (adding fields, renaming, removing, changing types).

## Steps

### 1. Plan the Change
- Document what fields are being added, removed, or modified.
- Identify the impact on existing data and related services.
- Determine if the change is **backward-compatible** (additive) or **breaking**.

### 2. Create a Migration Script
Create the script at `scripts/migrations/<timestamp>-<description>.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to database');

  const db = mongoose.connection.db;

  // Example: Add a new field with default value
  await db.collection('products').updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'defaultValue' } }
  );

  console.log('Migration completed');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

### 3. Update the Mongoose Schema
- Modify the model file in `src/models/`.
- Add new fields with default values for backward compatibility.
- Update validators and indexes as needed.

### 4. Update Dependent Code
- Update repositories if query patterns change.
- Update services if business logic is affected.
- Update controllers if request/response shape changes.
- Update frontend services and components if API contract changes.
- Update validators for new/modified fields.

### 5. Test the Migration
```bash
# Test on a copy of the database first
mongodump --uri="$MONGODB_URI" --out=./backup
node scripts/migrations/<script>.js
npm test
```

### 6. Run the Migration
```bash
# Backup production data first
mongodump --uri="$PROD_MONGODB_URI" --out=./backup-$(date +%Y%m%d)

# Run migration
NODE_ENV=production node scripts/migrations/<script>.js
```

### 7. Verify
- Check the collection in MongoDB Compass or `mongosh`.
- Test affected API endpoints manually.
- Run the test suite.

## Rules
- **Never** delete fields in production without a migration that handles existing data.
- **Always** add default values for new required fields.
- **Always** backup the database before running migrations.
- Name migration files with timestamps: `20260401-add-rating-to-products.js`.
- Keep a migration log in `scripts/migrations/README.md`.

## Rollback Plan
- Keep the backup created before migration.
- Create a reverse migration script if needed.
- Test the rollback script before running the forward migration.
