import { commentService } from '../services/comment.service.js';
import { successResponse } from '../utils/response.js';

export const commentController = {
  async getTaskComments(req, res, next) {
    try {
      const comments = await commentService.getCommentsByTaskId(req.params.id);
      return successResponse(res, comments, 'Comments retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  async createTaskComment(req, res, next) {
    try {
      const comment = await commentService.addComment(req.params.id, req.body);
      return successResponse(res, comment, 'Comment added successfully', 201);
    } catch (error) {
      next(error);
    }
  }
};
