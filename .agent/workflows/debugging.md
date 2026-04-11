---
description: Step-by-step workflow for diagnosing and fixing bugs
---

# Debugging Workflow

## Overview
Use this workflow when investigating and fixing bugs in the cafeteria ordering system.

## Steps

### 1. Reproduce the Bug
- Get the exact steps to reproduce the issue.
- Identify the environment (development, staging, production).
- Note the expected behavior vs. actual behavior.
- Capture the error message, stack trace, and HTTP status code (if applicable).

### 2. Check Logs
- Review server logs for errors around the time of the issue:
  ```bash
  # Check recent logs
  npm run logs
  # Or tail the log file
  tail -f logs/error.log
  ```
- Look for: uncaught exceptions, unhandled promise rejections, Mongoose errors.
- Check browser console for frontend errors.

### 3. Isolate the Layer
Determine which layer the bug originates from:

| Symptom | Likely Layer |
|---------|-------------|
| 500 Internal Server Error | Service or Repository |
| 400 Bad Request | Controller (validation) |
| 401/403 errors | Auth middleware |
| Data not loading in UI | Frontend service or API call |
| Wrong data displayed | Service logic or query |
| Mongoose CastError | Invalid ObjectId in request |
| Duplicate key error | Missing unique constraint handling |

### 4. Inspect the Code Path
- Trace the request flow: **Route → Middleware → Controller → Service → Repository → Model**.
- Add temporary `console.log` or use a debugger at each layer to narrow down.
- Check for:
  - Missing `await` on async calls
  - Incorrect query conditions
  - Missing error handling in `catchAsync`
  - Undefined variables or wrong imports

### 5. Check Database State
- Use MongoDB Compass or `mongosh` to inspect the collection data:
  ```bash
  mongosh
  use cafeteria_db
  db.collection.find({ _id: ObjectId("...") })
  ```
- Verify the document exists and has the expected shape.
- Check indexes with `db.collection.getIndexes()`.

### 6. Fix the Bug
- Make the minimal necessary change to fix the issue.
- Ensure the fix doesn't break other functionality.
- Add a guard or validation to prevent the same class of bug in the future.

### 7. Write a Regression Test
- Write a test that would have caught the bug:
  ```javascript
  it('should handle [edge case that caused the bug]', async () => {
    // Arrange → Act → Assert
  });
  ```
- Ensure the test fails without the fix and passes with it.

### 8. Verify the Fix
- Reproduce the original steps — confirm the bug is resolved.
- Run the full test suite to check for regressions:
  ```bash
  npm test
  ```
- Test related features manually.

### 9. Document the Fix
- Add a comment in the code explaining **why** the fix was needed (if non-obvious).
- Commit with a descriptive message: `fix: prevent duplicate order submission on slow network`.
