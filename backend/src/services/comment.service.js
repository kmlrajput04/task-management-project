import { commentRepository } from '../repositories/comment.repository.js';

export const commentService = {
  async getCommentsByTaskId(taskId) {
    return await commentRepository.findByTaskId(taskId);
  },

  async addComment(taskId, data) {
    return await commentRepository.create({ taskId, ...data });
  }
};
