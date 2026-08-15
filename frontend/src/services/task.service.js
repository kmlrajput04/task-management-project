import api from './api';

export const taskService = {
  async getAllTasks(params) {
    return await api.get('/tasks', { params });
  },

  async getTaskById(id) {
    return await api.get(`/tasks/${id}`);
  },

  async createTask(data) {
    return await api.post('/tasks', data);
  },

  async updateTask(id, data) {
    return await api.put(`/tasks/${id}`, data);
  },

  async deleteTask(id) {
    return await api.delete(`/tasks/${id}`);
  },

  async getTaskComments(taskId) {
    return await api.get(`/tasks/${taskId}/comments`);
  },

  async addTaskComment(taskId, data) {
    return await api.post(`/tasks/${taskId}/comments`, data);
  },

  async getTaskActivity(taskId) {
    return await api.get(`/tasks/${taskId}/activity`);
  }
};
