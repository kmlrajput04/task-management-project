import React from 'react';
import { Select } from '../ui';

export const TaskStatusFilter = ({ value, onChange }) => {
  const options = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'BLOCKED', label: 'Blocked' }
  ];

  return (
    <Select
      label="Status"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder="All Statuses"
    />
  );
};

export default TaskStatusFilter;
