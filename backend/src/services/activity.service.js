import activityRepository from '../repositories/activity.repository.js';
import tasksRepository from '../repositories/tasks.repository.js';
import { NotFoundError } from '../utils/errors.js';

export const activityService = {
  async recordActivity({ taskId, userId, action, oldValue = null, newValue = null }) {
    return await activityRepository.create({
      taskId,
      userId,
      action,
      oldValue: oldValue !== null ? String(oldValue) : null,
      newValue: newValue !== null ? String(newValue) : null
    });
  },

  async getTaskActivity(taskId) {
    // Validate task existence first
    const taskExists = await tasksRepository.findById(taskId);
    if (!taskExists) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }

    return await activityRepository.findByTaskId(taskId);
  }
};

export default activityService;
