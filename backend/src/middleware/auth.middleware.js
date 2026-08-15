import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded; // Contains id, email, role
      next();
    } catch (jwtError) {
      throw new UnauthorizedError('Token is invalid or expired');
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
