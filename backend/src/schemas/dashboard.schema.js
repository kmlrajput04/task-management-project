import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  userId: z.string().uuid('Invalid user ID format (must be a valid UUID)').optional()
});
