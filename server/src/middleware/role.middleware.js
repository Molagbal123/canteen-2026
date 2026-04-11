import { ForbiddenError } from '../utils/errors.js';

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError('You do not have permission for this action'));
  }
  next();
};
