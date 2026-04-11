# Database Design Rules

## Schema Conventions
- Every schema must include `timestamps: true` for automatic `createdAt` / `updatedAt`.
- Use **soft deletes** (`isDeleted: Boolean, deletedAt: Date`) for critical entities (users, orders).
- Use `mongoose-paginate-v2` plugin for collections that require pagination.
- Define **indexes** on frequently queried fields (e.g., `email`, `status`, `category`).

## Core Collections

### Users
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, unique, lowercase |
| password | String | Required, select: false |
| phone | String | Optional |
| role | String | Enum: customer, staff, admin |
| avatar | String | URL to profile image |
| isActive | Boolean | Default: true |

### Products (Menu Items)
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| description | String | Optional |
| price | Number | Required, min: 0 |
| category | ObjectId | Ref: Category |
| image | String | URL |
| isAvailable | Boolean | Default: true |
| preparationTime | Number | Minutes |

### Categories
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, unique |
| description | String | Optional |
| displayOrder | Number | For sorting in UI |

### Orders
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| items | Array | [{product, quantity, price}] |
| totalAmount | Number | Calculated |
| status | String | Enum: pending, confirmed, preparing, ready, completed, cancelled |
| paymentMethod | String | Enum: cash, card, e-wallet |
| paymentStatus | String | Enum: unpaid, paid, refunded |
| note | String | Special instructions |
| orderNumber | String | Auto-generated, unique |

### Reviews
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref: User |
| product | ObjectId | Ref: Product |
| rating | Number | 1–5 |
| comment | String | Optional |

## Relationships
- Use `ObjectId` references for relationships; avoid embedding large sub-documents.
- Embed data only when it is read together and rarely updated independently (e.g., order items snapshot product price at order time).
- Use `populate()` judiciously — avoid deep nesting. Limit populated fields with `.select()`.

## Naming Conventions
- Collection names: **plural, lowercase** (e.g., `users`, `products`, `orders`).
- Schema field names: **camelCase**.
- Avoid abbreviations in field names.

## Data Integrity
- Use Mongoose **pre-save hooks** for derived fields (e.g., calculating `totalAmount` from order items).
- Use **unique indexes** for fields that must be unique (email, orderNumber).
- Set `required: true` on all mandatory fields.
- Use `enum` validators for fields with a fixed set of values.
- Use `min`/`max` validators for numeric fields.
