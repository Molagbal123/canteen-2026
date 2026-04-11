# Coding Standards

## General
- Use **ESLint** + **Prettier** for consistent formatting.
- Follow **camelCase** for variables/functions, **PascalCase** for classes/components, **UPPER_SNAKE_CASE** for constants.
- Maximum line length: **100 characters**.
- Use **async/await** instead of raw Promises or callbacks.
- Every function must have a JSDoc comment describing its purpose, params, and return value.

## Backend (Node.js / Express)
- Use **ES Modules** (`import/export`) syntax.
- Follow the **layered architecture**: Route → Controller → Service → Repository → Model.
- Never put business logic in controllers — delegate to services.
- Never put database queries in services — delegate to repositories.
- Keep controllers thin: validate input, call service, return response.
- Use **environment variables** via `dotenv` for all configuration. Never hardcode secrets.
- Use `express.json()` middleware; do not use `body-parser` separately.

## Frontend (React)
- Use **functional components** with hooks exclusively.
- Use **React Router v6** for navigation.
- Follow the folder structure: `pages/`, `components/`, `hooks/`, `services/`, `utils/`, `context/`.
- Shared UI elements go in `components/common/`.
- API calls go in `services/` — never call `fetch`/`axios` directly inside components.
- Use **CSS Modules** or **styled-components** for scoped styling.
- Prop types must be validated with **PropTypes** or **TypeScript interfaces**.

## File & Folder Naming
- Backend files: `kebab-case` (e.g., `order-controller.js`).
- React components: `PascalCase` (e.g., `OrderCard.jsx`).
- Test files: `<name>.test.js` or `<name>.spec.js`.

## Git Conventions
- Branch naming: `feature/<name>`, `fix/<name>`, `hotfix/<name>`.
- Commit messages follow **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- One logical change per commit. No "WIP" commits in `main`.
