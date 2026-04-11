# Error Handling Rules

## Custom Error Classes
- Create a base `AppError` class extending `Error` with `statusCode`, `errorCode`, and `isOperational` fields.
- Create specific subclasses:
  - `ValidationError` (400)
  - `AuthenticationError` (401)
  - `ForbiddenError` (403)
  - `NotFoundError` (404)
  - `ConflictError` (409)

```javascript
// Example: src/utils/errors.js
export class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}
```

## Global Error Middleware
- Register a **single global error handler** as the last middleware in Express.
- Log all errors with contextual info (request path, user ID, timestamp).
- In **production**, never expose stack traces or internal details to the client.
- In **development**, include stack traces in the response for debugging.

## Async Error Handling
- Wrap all async route handlers with a `catchAsync` utility:
```javascript
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```
- Never use bare `try/catch` in controllers — use `catchAsync` instead.

## Validation Errors
- Use **Joi** or **express-validator** for input validation.
- Return all validation errors at once, not one at a time.
- Validation must happen at the **controller layer** before calling services.

## Logging
- Use **Winston** or **Pino** for structured logging.
- Log levels: `error`, `warn`, `info`, `debug`.
- Log all errors with: timestamp, error code, message, stack trace, request ID.
- Never use `console.log` in production code.

## Database Errors
- Catch Mongoose-specific errors (duplicate key `11000`, validation errors) and convert them to appropriate `AppError` subclasses.
- Always handle `CastError` for invalid ObjectId formats.
