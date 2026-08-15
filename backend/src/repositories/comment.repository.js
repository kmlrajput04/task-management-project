import prisma from '../config/db.js';

export const commentRepository = {
  async findByTaskId(taskId) {
    // Placeholder for Phase 0
    return [];
  },

  async create(data) {
    // Placeholder for Phase 0
    return { id: 'temp-comment-id', ...data };
  }
};
