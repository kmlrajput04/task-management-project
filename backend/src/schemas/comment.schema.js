import { z } from 'zod';

export const createCommentSchema = z.object({
  userId: z.string().uuid('Invalid user ID format (must be a valid UUID)'),
  comment: z.string().min(1, 'Comment text is required')
});

export const taskIdSchema = z.object({
  id: z.string().uuid('Invalid task ID format (must be a valid UUID)')
});
