import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User authentication context is missing');
      }

      const hasAccess = roles.includes(req.user.role);
      if (!hasAccess) {
        throw new ForbiddenError('Access forbidden: insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default allowRoles;
