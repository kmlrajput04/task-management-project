import api from './api';

export const commentService = {
  async getComments(taskId) {
    return await api.get(`/tasks/${taskId}/comments`);
  },

  async addComment(taskId, commentData) {
    return await api.post(`/tasks/${taskId}/comments`, commentData);
  }
};

export default commentService;
