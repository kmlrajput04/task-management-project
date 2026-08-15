import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  name: z.string().trim().min(4, 'Name must be at least 4 characters').max(100),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole).default(UserRole.MEMBER),
  avatar: z.string().url('Avatar must be a valid URL').or(z.string().length(0)).optional().nullable(),
  phone: z.string().trim().min(4, 'Phone number is required and must have at least 4 digits').max(20)
});

export const updateUserSchema = createUserSchema.partial();

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format (must be a valid UUID)')
});
