import authService from '../services/auth.service.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { validateSchema } from '../utils/validation.js';
import { successResponse } from '../utils/response.js';

export const authController = {
  async login(req, res, next) {
    try {
      const validatedBody = validateSchema(loginSchema, req.body);
      const authData = await authService.login(validatedBody.email, validatedBody.password);

      return successResponse(res, authData, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      // req.user is populated by authMiddleware
      const userProfile = await authService.getUserProfile(req.user.id);
      return successResponse(res, userProfile, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default authController;
