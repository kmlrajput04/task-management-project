import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Select } from '../ui';

export const TaskAssigneeFilter = ({ value, onChange }) => {
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['assignees-list'],
    queryFn: async () => {
      const res = await userService.getAllUsers({ limit: 100 });
      return res;
    }
  });

  const users = (usersResponse?.data || []).filter(u => u.role !== 'ADMIN');
  const options = users.map((u) => ({
    value: u.id,
    label: u.name
  }));

  return (
    <Select
      label="Assignee"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder={isLoading ? 'Loading assignees...' : 'All Assignees'}
      disabled={isLoading}
    />
  );
};

export default TaskAssigneeFilter;
