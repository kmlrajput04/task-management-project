import { taskRepository } from '../repositories/task.repository.js';

export const taskService = {
  async getAllTasks(params) {
    return await taskRepository.findAll(params);
  },

  async getTaskById(id) {
    return await taskRepository.findById(id);
  },

  async createTask(data) {
    return await taskRepository.create(data);
  },

  async updateTask(id, data) {
    return await taskRepository.update(id, data);
  },

  async deleteTask(id) {
    return await taskRepository.delete(id);
  }
};
