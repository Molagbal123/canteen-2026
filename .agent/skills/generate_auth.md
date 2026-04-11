---
name: Generate Auth
description: Generate authentication and authorization modules (JWT, middleware, routes)
---

# Generate Authentication & Authorization

## When to Use
When setting up the auth system or adding new auth-related features (login, register, password reset, role guards).

## Components to Generate

### 1. Auth Controller — `src/controllers/auth.controller.js`

```javascript
import { catchAsync } from '../utils/catch-async.js';
import * as authService from '../services/auth.service.js';

export const register = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setTokenCookie(res, refreshToken);
  res.status(201).json({ success: true, data: { user, accessToken } });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setTokenCookie(res, refreshToken);
  res.status(200).json({ success: true, data: { user, accessToken } });
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken: newRefresh } = await authService.refresh(token);
  setTokenCookie(res, newRefresh);
  res.status(200).json({ success: true, data: { accessToken } });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

const setTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
```

### 2. Auth Service — `src/services/auth.service.js`
- `register(data)`: Hash password → create user → generate tokens.
- `login({ email, password })`: Find user → compare password → generate tokens.
- `logout(userId)`: Revoke refresh token in DB.
- `refresh(token)`: Verify refresh token → issue new pair.

### 3. JWT Utility — `src/utils/jwt.js`

```javascript
import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
```

### 4. Auth Middleware — `src/middleware/auth.middleware.js`

```javascript
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/user.model.js';
import { AuthenticationError } from '../utils/errors.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    throw new AuthenticationError('No token provided');

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AuthenticationError('User not found');

  req.user = user;
  next();
};
```

### 5. Role Middleware — `src/middleware/role.middleware.js`

```javascript
import { ForbiddenError } from '../utils/errors.js';

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    throw new ForbiddenError('You do not have permission for this action');
  next();
};
```

### 6. Auth Routes — `src/routes/auth.routes.js`

```javascript
import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/logout', authenticate, authCtrl.logout);
router.post('/refresh-token', authCtrl.refreshToken);
router.get('/me', authenticate, authCtrl.getMe);

export default router;
```

## Checklist
- [ ] JWT utility with access & refresh token functions
- [ ] Auth controller with register, login, logout, refresh, getMe
- [ ] Auth service with business logic
- [ ] Auth middleware for token verification
- [ ] Role middleware for RBAC
- [ ] Auth routes registered at `/api/v1/auth`
- [ ] Refresh token stored as HttpOnly cookie
- [ ] Passwords hashed with bcrypt
