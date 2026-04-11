# API Design Rules

## RESTful Conventions
- Use **nouns** for resources, **HTTP verbs** for actions:
  - `GET /api/products` — list all products
  - `GET /api/products/:id` — get one product
  - `POST /api/products` — create a product
  - `PUT /api/products/:id` — update a product
  - `DELETE /api/products/:id` — delete a product
- All API routes must be prefixed with `/api/v1/`.
- Use **plural** resource names: `/orders`, `/categories`, `/users`.

## Request & Response Format
- All request/response bodies use **JSON**.
- Successful responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```
- Error responses follow this structure:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

## HTTP Status Codes
| Code | Usage |
|------|-------|
| 200  | Success (GET, PUT) |
| 201  | Created (POST) |
| 204  | No Content (DELETE) |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Resource Not Found |
| 409  | Conflict (duplicate entry) |
| 500  | Internal Server Error |

## Pagination
- Use query params: `?page=1&limit=10`.
- Response must include pagination metadata:
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 85,
    "totalPages": 9
  }
}
```

## Filtering & Sorting
- Filter via query params: `?category=beverages&status=available`.
- Sort via: `?sort=price&order=asc`.

## Versioning
- API version in URL path: `/api/v1/...`.
- When breaking changes are needed, create `/api/v2/...` and deprecate v1 gracefully.
