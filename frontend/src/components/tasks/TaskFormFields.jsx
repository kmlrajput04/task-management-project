import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { externalService } from '../../services/external.service';
import { Input, Textarea, Select } from '../ui';

export const TaskFormFields = ({ register, errors, disabled = false }) => {
  // Query users asynchronously for assignee options
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['assignees-list'],
    queryFn: async () => {
      const res = await userService.getAllUsers({ limit: 100 });
      return res;
    }
  });

  // Query external users for client/contact options
  const { data: externalResponse, isLoading: isLoadingExternal } = useQuery({
    queryKey: ['external-users-list-dropdown'],
    queryFn: async () => {
      const res = await externalService.getExternalUsers();
      return res.data || [];
    }
  });

  const users = (usersResponse?.data || []).filter(u => u.role !== 'ADMIN');
  const assigneeOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email})`
  }));

  const externalUsers = Array.isArray(externalResponse) ? externalResponse : [];
  const clientOptions = externalUsers.map((u) => ({
    value: u.name,
    label: `${u.name} (${u.company})`
  }));

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'BLOCKED', label: 'Blocked' }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ];

  return (
    <div className="space-y-4">
      <Input
        label="Title"
        placeholder="Enter task title"
        required
        disabled={disabled}
        error={errors.title?.message}
        autoFocus
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Describe the task details..."
        disabled={disabled}
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          options={statusOptions}
          disabled={disabled}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          disabled={disabled}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Assignee"
          options={assigneeOptions}
          placeholder={isLoading ? 'Loading users...' : 'Unassigned'}
          disabled={disabled || isLoading}
          error={errors.assignedToId?.message}
          {...register('assignedToId')}
        />

        <Select
          label="Link Client / External Contact"
          options={clientOptions}
          placeholder={isLoadingExternal ? 'Loading contacts...' : 'No linked client'}
          disabled={disabled || isLoadingExternal}
          error={errors.externalClient?.message}
          {...register('externalClient')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          disabled={disabled}
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>
    </div>
  );
};

export default TaskFormFields;
