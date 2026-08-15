import { taskService } from '../services/task.service.js';
import { successResponse } from '../utils/response.js';

export const taskController = {
  async getAllTasks(req, res, next) {
    try {
      const tasks = await taskService.getAllTasks(req.query);
      return successResponse(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      return successResponse(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body);
      return successResponse(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      return successResponse(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(req.params.id);
      return successResponse(res, result, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};
