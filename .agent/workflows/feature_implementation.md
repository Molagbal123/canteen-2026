---
description: Step-by-step workflow for implementing a new feature end-to-end
---

# Feature Implementation Workflow

## Overview
Use this workflow when implementing a new feature for the cafeteria ordering system, from database to UI.

## Steps

### 1. Requirements Analysis
- Clarify the feature requirements with the user.
- Identify which entities, endpoints, and UI pages are affected.
- List acceptance criteria.

### 2. Database Layer
- Define or update the Mongoose model using the `generate_model` skill.
- Add any new indexes or schema modifications.
- If modifying an existing model, follow the `database_migration` workflow.

### 3. Repository Layer
- Create or update the repository file using the `generate_repository` skill.
- Add any custom query methods needed by this feature.

### 4. Service Layer
- Create or update the service file using the `generate_service` skill.
- Implement all business logic, validation, and error handling.
- Write unit tests for service functions.

### 5. Controller Layer
- Create or update the controller using the `generate_controller` skill.
- Keep controllers thin — validate input, call service, format response.

### 6. Input Validation
- Create a validation schema at `src/validators/<resource>.validator.js` using **Joi**.
- Define separate schemas for `create` and `update` operations.
- Validate all user-facing inputs.

### 7. Route Definition
- Create or update routes using the `generate_route` skill.
- Apply appropriate middleware (auth, role, validation).
- Register the route in `src/routes/index.js`.

### 8. Frontend — API Service
- Create or update the API service in `src/services/<resource>.service.js`.
- Map each endpoint to a service method.

### 9. Frontend — UI Components
- Create the customer-facing page using `generate_frontend_page` skill.
- Create the admin page using `generate_admin_page` skill (if applicable).
- Build reusable components as needed.

### 10. Testing
- Write API tests using the `testing` workflow.
- Test all CRUD operations and edge cases.
- Test authentication and authorization.

### 11. Code Review
- Run the `code_review` workflow before marking the feature complete.
- Ensure all checklist items from each layer are satisfied.

### 12. Documentation
- Update API documentation (endpoint, request/response examples).
- Update README if the feature introduces new setup steps.
