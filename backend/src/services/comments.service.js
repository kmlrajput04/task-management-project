import commentsRepository from '../repositories/comments.repository.js';
import tasksRepository from '../repositories/tasks.repository.js';
import usersRepository from '../repositories/users.repository.js';
import activityService from './activity.service.js';
import notificationsService from './notifications.service.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const commentsService = {
  async getTaskComments(taskId) {
    // Validate task existence
    const taskExists = await tasksRepository.findById(taskId);
    if (!taskExists) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }

    return await commentsRepository.findByTaskId(taskId);
  },

  async createComment(taskId, data) {
    const { userId, comment } = data;

    // 1. Validate task existence
    const task = await tasksRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }

    // 2. Validate user existence
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    // 3. Trim comment and reject if empty
    const trimmedComment = comment ? comment.trim() : '';
    if (!trimmedComment) {
      throw new ValidationError('Comment cannot be empty', [
        { field: 'comment', message: 'Comment cannot be empty or only whitespace' }
      ]);
    }

    // 4. Create the comment record
    const createdComment = await commentsRepository.create({
      taskId,
      userId,
      comment: trimmedComment
    });

    // 5. Log the COMMENT_ADDED activity
    await activityService.recordActivity({
      taskId,
      userId,
      action: 'COMMENT_ADDED',
      oldValue: null,
      newValue: trimmedComment
    });

    // 6. Trigger COMMENT_ADDED notification
    if (task.assignedToId && task.assignedToId !== userId) {
      try {
        await notificationsService.createNotification(task.assignedToId, {
          title: 'New Comment',
          message: `${user.name} commented on task '${task.title}'`,
          type: 'COMMENT_ADDED'
        });
      } catch (err) {
        console.error('Failed to trigger comment notification:', err);
      }
    }

    // Return the fresh comment including user relation
    const commentsList = await commentsRepository.findByTaskId(taskId);
    return commentsList.find(c => c.id === createdComment.id) || createdComment;
  }
};

export default commentsService;
