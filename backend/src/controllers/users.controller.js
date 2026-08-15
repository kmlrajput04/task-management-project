import usersService from '../services/users.service.js';
import { createUserSchema, updateUserSchema, userIdSchema } from '../schemas/user.schema.js';
import { validateSchema } from '../utils/validation.js';
import { successResponse, paginationResponse } from '../utils/response.js';
import { parseQueryParams } from '../utils/query.js';
import { BadRequestError } from '../utils/errors.js';

export const usersController = {
  async getAllUsers(req, res, next) {
    try {
      const allowedSortFields = ['name', 'email', 'role', 'createdAt', 'updatedAt'];
      const params = parseQueryParams(req.query, allowedSortFields);
      
      const { data, meta } = await usersService.getUsers(params);
      
      return paginationResponse(res, data, meta, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      // ID validation
      const idResult = userIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid user ID format (must be a valid UUID)');
      }

      const user = await usersService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const validatedData = validateSchema(createUserSchema, req.body);
      const user = await usersService.createUser(validatedData);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      // ID validation
      const idResult = userIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid user ID format (must be a valid UUID)');
      }

      const validatedData = validateSchema(updateUserSchema, req.body);
      const user = await usersService.updateUser(req.params.id, validatedData);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      // ID validation
      const idResult = userIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid user ID format (must be a valid UUID)');
      }

      await usersService.deleteUser(req.params.id);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default usersController;
