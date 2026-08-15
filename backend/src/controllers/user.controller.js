import { userService } from '../services/user.service.js';
import { successResponse } from '../utils/response.js';

export const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers(req.query);
      return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);
      return successResponse(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};
