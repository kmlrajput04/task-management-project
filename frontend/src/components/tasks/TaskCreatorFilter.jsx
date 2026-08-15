import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Select } from '../ui';

export const TaskCreatorFilter = ({ value, onChange }) => {
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['assignees-list'],
    queryFn: async () => {
      const res = await userService.getAllUsers({ limit: 100 });
      return res;
    }
  });

  // Creators must be ADMIN or MANAGER role
  const creators = (usersResponse?.data || []).filter(
    (u) => u.role === 'ADMIN' || u.role === 'MANAGER'
  );

  const options = creators.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`
  }));

  return (
    <Select
      label="Assigned By"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder={isLoading ? 'Loading assignors...' : 'All Assignors'}
      disabled={isLoading}
    />
  );
};

export default TaskCreatorFilter;
