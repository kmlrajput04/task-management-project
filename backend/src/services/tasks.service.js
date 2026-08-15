import BaseService from './base.service.js';
import tasksRepository from '../repositories/tasks.repository.js';
import usersRepository from '../repositories/users.repository.js';
import activityService from './activity.service.js';
import notificationsService from './notifications.service.js';
import prisma from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { getPaginationMeta } from '../utils/pagination.js';

export class TasksService extends BaseService {
  constructor() {
    super(tasksRepository, 'Task');
  }

  async getTasks(params) {
    const { page, limit, skip, search, status, priority, assignee, sortBy, sortOrder } = params;

    if (assignee) {
      const assigneeExists = await usersRepository.findById(assignee);
      if (!assigneeExists) {
        throw new NotFoundError(`Assignee User with ID ${assignee} not found`);
      }
    }

    const { data, total } = await tasksRepository.findMany({
      skip,
      limit,
      search,
      status,
      priority,
      assignee,
      sortBy,
      sortOrder
    });

    const meta = getPaginationMeta(total, page, limit);

    return { data, meta };
  }

  async getTaskById(id) {
    const task = await tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(data) {
    // 1. Validate creator existence
    const creatorExists = await usersRepository.findById(data.createdById);
    if (!creatorExists) {
      throw new NotFoundError(`Creator User with ID ${data.createdById} not found`);
    }

    // 2. Validate assignee existence if provided
    if (data.assignedToId) {
      const assigneeExists = await usersRepository.findById(data.assignedToId);
      if (!assigneeExists) {
        throw new NotFoundError(`Assignee User with ID ${data.assignedToId} not found`);
      }
    }

    const taskData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    };

    const createdTask = await tasksRepository.create(taskData);

    // 3. Log TASK_CREATED activity
    await activityService.recordActivity({
      taskId: createdTask.id,
      userId: createdTask.createdById,
      action: 'TASK_CREATED',
      oldValue: null,
      newValue: createdTask.title
    });

    // 4. Trigger assignment notification
    if (createdTask.assignedToId) {
      try {
        await notificationsService.createNotification(createdTask.assignedToId, {
          title: 'New Task Assigned',
          message: `${creatorExists.name} assigned task '${createdTask.title}' to you`,
          type: 'TASK_ASSIGNED'
        });
      } catch (err) {
        console.error('Failed to trigger task assignment notification:', err);
      }
    }

    return createdTask;
  }

  async updateTask(id, data) {
    // 1. Validate task existence
    const oldTask = await this.checkExistence(id);

    // 2. Validate assignee existence if provided
    if (data.assignedToId) {
      const assigneeExists = await usersRepository.findById(data.assignedToId);
      if (!assigneeExists) {
        throw new NotFoundError(`Assignee User with ID ${data.assignedToId} not found`);
      }
    }

    // Extract performer userId and ignore it from repository update fields
    const { userId, ...taskFields } = data;
    const performerId = userId || oldTask.createdById;

    const taskData = {
      ...taskFields,
      dueDate: taskFields.dueDate !== undefined ? (taskFields.dueDate ? new Date(taskFields.dueDate) : null) : undefined
    };

    const updatedTask = await tasksRepository.update(id, taskData);

    // 3. Compare changed fields and log activities dynamically
    if (taskFields.status && taskFields.status !== oldTask.status) {
      await activityService.recordActivity({
        taskId: id,
        userId: performerId,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: taskFields.status
      });

      // Trigger status change notifications
      try {
        const creator = await prisma.user.findUnique({ where: { id: updatedTask.createdById } });
        const performer = await prisma.user.findUnique({ where: { id: performerId } });
        const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });

        const recipients = new Set();

        // 1. Task creator/assigner gets notified of all status changes (if not the performer)
        if (creator && creator.id !== performerId) {
          recipients.add(creator.id);
        }

        // 2. Admins get notified of completion (if not the performer)
        if (taskFields.status === 'COMPLETED') {
          admins.forEach(admin => {
            if (admin.id !== performerId) {
              recipients.add(admin.id);
            }
          });
        }

        for (const recipientId of recipients) {
          const isCompleted = taskFields.status === 'COMPLETED';
          await notificationsService.createNotification(recipientId, {
            title: isCompleted ? 'Task Completed' : 'Task Status Changed',
            message: `${performer?.name || 'Someone'} changed status of '${updatedTask.title}' to ${taskFields.status.replace('_', ' ')}`,
            type: isCompleted ? 'TASK_COMPLETED' : 'STATUS_CHANGED'
          });
        }
      } catch (err) {
        console.error('Failed to trigger task status change notifications:', err);
      }
    }

    if (taskFields.priority && taskFields.priority !== oldTask.priority) {
      await activityService.recordActivity({
        taskId: id,
        userId: performerId,
        action: 'PRIORITY_CHANGED',
        oldValue: oldTask.priority,
        newValue: taskFields.priority
      });
    }

    if (taskFields.assignedToId !== undefined && taskFields.assignedToId !== oldTask.assignedToId) {
      await activityService.recordActivity({
        taskId: id,
        userId: performerId,
        action: 'ASSIGNEE_CHANGED',
        oldValue: oldTask.assignedToId,
        newValue: taskFields.assignedToId
      });

      // Trigger TASK_ASSIGNED notification for assignee changes
      if (taskFields.assignedToId) {
        try {
          const performer = await prisma.user.findUnique({ where: { id: performerId } });
          await notificationsService.createNotification(taskFields.assignedToId, {
            title: 'New Task Assigned',
            message: `${performer?.name || 'Someone'} assigned task '${updatedTask.title}' to you`,
            type: 'TASK_ASSIGNED'
          });
        } catch (err) {
          console.error('Failed to trigger task reassignment notification:', err);
        }
      }
    }

    if (taskFields.dueDate !== undefined) {
      const oldTime = oldTask.dueDate ? new Date(oldTask.dueDate).getTime() : null;
      const newTime = taskFields.dueDate ? new Date(taskFields.dueDate).getTime() : null;
      if (oldTime !== newTime) {
        await activityService.recordActivity({
          taskId: id,
          userId: performerId,
          action: 'DUE_DATE_CHANGED',
          oldValue: oldTask.dueDate ? new Date(oldTask.dueDate).toISOString() : null,
          newValue: taskFields.dueDate ? new Date(taskFields.dueDate).toISOString() : null
        });
      }
    }

    return updatedTask;
  }

  async deleteTask(id) {
    await this.checkExistence(id);
    return await tasksRepository.delete(id);
  }
}

export const tasksService = new TasksService();
export default tasksService;
