import tasksService from '../services/tasks.service.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema, taskListQuerySchema } from '../schemas/task.schema.js';
import { validateSchema } from '../utils/validation.js';
import { successResponse, paginationResponse } from '../utils/response.js';
import { parseQueryParams } from '../utils/query.js';
import { BadRequestError } from '../utils/errors.js';

export const tasksController = {
  async getAllTasks(req, res, next) {
    try {
      // Convert empty strings to undefined to allow optional Zod validation
      const cleanedQuery = { ...req.query };
      Object.keys(cleanedQuery).forEach((key) => {
        if (cleanedQuery[key] === '') {
          delete cleanedQuery[key];
        }
      });

      // Validate query parameters
      const validatedQuery = validateSchema(taskListQuerySchema, cleanedQuery);

      // Parse and normalize parameters
      const allowedSortFields = ['title', 'priority', 'status', 'dueDate', 'createdAt', 'updatedAt'];
      const queryParams = parseQueryParams(validatedQuery, allowedSortFields);

      // Extract specific task filters from validated query
      const filters = {
        ...queryParams,
        status: validatedQuery.status,
        priority: validatedQuery.priority,
        assignee: validatedQuery.assignee
      };

      const { data, meta } = await tasksService.getTasks(filters);
      
      return paginationResponse(res, data, meta, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      const task = await tasksService.getTaskById(req.params.id);
      return successResponse(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createTask(req, res, next) {
    try {
      const validatedData = validateSchema(createTaskSchema, req.body);
      const task = await tasksService.createTask(validatedData);
      return successResponse(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      const validatedData = validateSchema(updateTaskSchema, req.body);
      const updateData = {
        ...validatedData,
        userId: req.user.id
      };
      
      const task = await tasksService.updateTask(req.params.id, updateData);
      return successResponse(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      await tasksService.deleteTask(req.params.id);
      return successResponse(res, null, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default tasksController;
