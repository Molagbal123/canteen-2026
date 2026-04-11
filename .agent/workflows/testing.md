---
description: Step-by-step workflow for writing and running tests
---

# Testing Workflow

## Test Stack
- **Backend**: Jest + Supertest
- **Frontend**: Jest + React Testing Library
- **Database**: `mongodb-memory-server` for isolated tests

## Steps

### 1. Setup Test Environment
Create test helpers at `tests/setup.js`:

```javascript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
```

### 2. Backend — API Integration Tests
File: `tests/api/<resource>.test.js`

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { connectTestDB, disconnectTestDB, clearTestDB } from '../setup.js';

describe('GET /api/v1/products', () => {
  beforeAll(connectTestDB);
  afterAll(disconnectTestDB);
  afterEach(clearTestDB);

  it('should return paginated products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

### 3. Backend — Service Unit Tests
File: `tests/unit/services/<resource>.service.test.js`
- Mock the repository layer with `jest.mock()`.
- Test business logic in isolation.

### 4. Frontend — Component Tests
File: `src/components/__tests__/<Component>.test.jsx`
- Use `render`, `screen`, `fireEvent` from React Testing Library.
- Test rendering, user interactions, and state changes.

### 5. Running Tests

```bash
npm test                              # Run all
npm test -- --coverage                # With coverage
npm test -- tests/api/product.test.js # Specific file
npm test -- --watch                   # Watch mode
```

### 6. Coverage Requirements
- Minimum: **80%** for statements, branches, functions, lines.
- Critical paths (auth, orders): **90%+**.
