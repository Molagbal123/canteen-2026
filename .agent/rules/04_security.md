# Security Rules

## Authentication
- Use **JWT** (JSON Web Tokens) for stateless authentication.
- Issue two tokens: **access token** (15 min TTL) and **refresh token** (7 days TTL).
- Store refresh tokens in the database with user association for revocation.
- Hash passwords with **bcrypt** (minimum 12 salt rounds).
- Never store plain-text passwords anywhere (database, logs, responses).

## Authorization
- Implement **Role-Based Access Control (RBAC)** with roles: `customer`, `staff`, `admin`.
- Use an `authorize(...roles)` middleware to protect routes by role.
- Default role for new registrations: `customer`.
- Admin-only routes: user management, system settings, reports.
- Staff routes: order management, menu updates, inventory.

## Input Validation & Sanitization
- Validate and sanitize **all** user inputs on the server side.
- Use `express-mongo-sanitize` to prevent NoSQL injection.
- Use `xss-clean` to prevent XSS attacks.
- Use `helmet` for security headers.
- Use `hpp` to prevent HTTP parameter pollution.

## Rate Limiting
- Apply `express-rate-limit` globally (100 requests per 15 min per IP).
- Apply stricter limits on auth endpoints (10 requests per 15 min per IP).
- Return `429 Too Many Requests` when limits are exceeded.

## CORS
- Configure CORS to allow only known frontend origins.
- Never use `cors({ origin: '*' })` in production.

## Data Protection
- Never return sensitive fields (password, tokens) in API responses.
- Use Mongoose `select: false` on sensitive schema fields.
- Use `.select('-password -__v')` in queries returning user data.
- Implement request logging but **redact** sensitive fields (passwords, tokens, card numbers).

## File Uploads
- Validate file type (MIME type) and size before processing.
- Maximum file size: **5MB** for images.
- Allowed types: `image/jpeg`, `image/png`, `image/webp`.
- Store files in a dedicated `/uploads` directory or cloud storage (e.g., Cloudinary).
- Generate unique filenames; never use the original filename directly.

## Environment
- All secrets and credentials go in `.env` — never commit `.env` to version control.
- `.env.example` must be maintained with all required keys (values left blank).
