import React from 'react';
import { Select } from '../ui';

export const TaskSortSelect = ({ sort, order, onSortChange, onOrderChange }) => {
  const sortFields = [
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' }
  ];

  const orderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  return (
    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
      <div className="w-1/2">
        <Select
          label="Sort By"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortFields}
          placeholder="None"
        />
      </div>
      <div className="w-1/2">
        <Select
          label="Order"
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
          options={orderOptions}
          placeholder="Order"
        />
      </div>
    </div>
  );
};

export default TaskSortSelect;
