import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
  avatar: z.string().url('Avatar must be a valid URL').or(z.string().length(0)).optional().nullable(),
  phone: z.string().min(4, 'Phone number must be at least 4 digits').max(20)
});

export const updateUserSchema = createUserSchema.partial();

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format (must be a valid UUID)')
});
