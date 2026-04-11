---
description: Step-by-step workflow for conducting code reviews
---

# Code Review Workflow

## Overview
Use this workflow before merging any feature branch into `main`.

## Steps

### 1. Pre-Review Checks
- Ensure all tests pass: `npm test`
- Ensure no linting errors: `npm run lint`
- Verify the branch is up-to-date with `main`.

### 2. Architecture Review
- [ ] Follows layered architecture: Route → Controller → Service → Repository → Model
- [ ] No business logic in controllers
- [ ] No direct DB queries in services
- [ ] No circular dependencies between modules

### 3. Code Quality
- [ ] Functions are small and single-purpose
- [ ] Variable/function names are descriptive
- [ ] No hardcoded values — uses constants or env vars
- [ ] No `console.log` — uses structured logger
- [ ] No commented-out code blocks
- [ ] DRY — no duplicated logic

### 4. Security Review
- [ ] User inputs are validated and sanitized
- [ ] Sensitive fields excluded from API responses
- [ ] Auth middleware applied to protected routes
- [ ] Role checks in place for admin/staff routes
- [ ] No secrets in code — all in `.env`

### 5. Error Handling
- [ ] All async handlers use `catchAsync`
- [ ] Custom errors thrown with correct status codes
- [ ] Edge cases handled (not found, duplicate, invalid ID)
- [ ] Validation errors return all issues at once

### 6. Database
- [ ] Indexes added for queried fields
- [ ] `select: false` on sensitive fields
- [ ] `runValidators: true` on updates
- [ ] Pagination used for list queries

### 7. Frontend
- [ ] Loading, error, and empty states handled
- [ ] No direct API calls in components — uses services
- [ ] Components are reusable and focused
- [ ] Responsive design works on mobile
- [ ] No inline styles — uses CSS Modules

### 8. Testing
- [ ] Tests cover happy path and error cases
- [ ] Coverage meets minimum thresholds (80%)
- [ ] Tests are independent and clean up after themselves

### 9. Final
- [ ] Commit messages follow Conventional Commits
- [ ] No merge conflicts
- [ ] Documentation updated if needed
