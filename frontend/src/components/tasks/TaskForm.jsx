import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TaskFormFields from './TaskFormFields';
import TaskFormActions from './TaskFormActions';
import useAuth from '../../hooks/useAuth';

const taskValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  assignedToId: z.string().uuid('Invalid user ID').or(z.literal('')).optional().nullable(),
  dueDate: z.string().or(z.literal('')).optional().nullable(),
  externalClient: z.string().or(z.literal('')).optional().nullable()
});

export const TaskForm = ({ mode = 'create', initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [generalError, setGeneralError] = useState('');
  const { user: currentUser } = useAuth();

  // Format initial values
  const defaultValues = {
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'PENDING',
    priority: initialData.priority || 'MEDIUM',
    assignedToId: initialData.assignedToId || '',
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    externalClient: initialData.externalClient || ''
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskValidationSchema),
    defaultValues
  });

  const handleFormSubmit = async (data) => {
    try {
      setGeneralError('');
      
      const payload = {
        title: data.title.trim(),
        description: data.description ? data.description.trim() : null,
        status: data.status,
        priority: data.priority,
        assignedToId: data.assignedToId || null,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        externalClient: data.externalClient || null
      };

      if (mode === 'create') {
        payload.createdById = currentUser?.id;
      }

      await onSubmit(payload);
    } catch (err) {
      setGeneralError(err.message || 'An error occurred during submission.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <TaskFormFields register={register} errors={errors} disabled={loading} />
      <TaskFormActions mode={mode} onCancel={onCancel} loading={loading} generalError={generalError} />
    </form>
  );
};

export default TaskForm;
