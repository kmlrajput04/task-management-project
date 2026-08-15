import commentsService from '../services/comments.service.js';
import activityService from '../services/activity.service.js';
import { createCommentSchema, taskIdSchema } from '../schemas/comment.schema.js';
import { validateSchema } from '../utils/validation.js';
import { successResponse } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

export const commentsController = {
  async getTaskComments(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      const comments = await commentsService.getTaskComments(req.params.id);
      return successResponse(res, comments, 'Comments retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createTaskComment(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      const validatedBody = validateSchema(createCommentSchema, req.body);
      const comment = await commentsService.createComment(req.params.id, validatedBody);
      
      return successResponse(res, comment, 'Comment added successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async getTaskActivity(req, res, next) {
    try {
      const idResult = taskIdSchema.safeParse(req.params);
      if (!idResult.success) {
        throw new BadRequestError('Invalid task ID format (must be a valid UUID)');
      }

      const activity = await activityService.getTaskActivity(req.params.id);
      return successResponse(res, activity, 'Activity retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};

export default commentsController;
