import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  assignedToId: z.string().uuid('Invalid assignee user ID').optional().nullable(),
  createdById: z.string().uuid('Invalid creator user ID'),
  dueDate: z.string().datetime('Due date must be a valid ISO date').optional().nullable(),
  externalClient: z.string().max(200).optional().nullable()
});

export const updateTaskSchema = createTaskSchema.partial().omit({ createdById: true }).extend({
  userId: z.string().uuid('Invalid performer user ID format').optional()
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format (must be a valid UUID)')
});

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignee: z.string().uuid('Invalid assignee user ID').optional(),
  sort: z.enum(['title', 'priority', 'status', 'dueDate', 'createdAt', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc')
});
