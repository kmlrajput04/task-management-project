import React from 'react';
import { Select } from '../ui';

export const TaskPriorityFilter = ({ value, onChange }) => {
  const options = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' }
  ];

  return (
    <Select
      label="Priority"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      placeholder="All Priorities"
    />
  );
};

export default TaskPriorityFilter;
