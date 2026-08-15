import React from 'react';
import TaskStatusFilter from './TaskStatusFilter';
import TaskPriorityFilter from './TaskPriorityFilter';
import TaskAssigneeFilter from './TaskAssigneeFilter';
import TaskCreatorFilter from './TaskCreatorFilter';
import { Button, Select } from '../ui';
import { RotateCcw } from 'lucide-react';

export const TaskFilters = ({ filters, onFilterChange, onReset, showAssigneeFilter = true }) => {
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

  const gridCols = showAssigneeFilter
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'
    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';

  return (
    <div className="bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 mb-6">
      <div className={`grid ${gridCols} gap-4 items-end`}>
        <TaskStatusFilter
          value={filters.status}
          onChange={(val) => onFilterChange({ status: val })}
        />
        <TaskPriorityFilter
          value={filters.priority}
          onChange={(val) => onFilterChange({ priority: val })}
        />
        {showAssigneeFilter && (
          <TaskAssigneeFilter
            value={filters.assignee}
            onChange={(val) => onFilterChange({ assignee: val })}
          />
        )}
        <TaskCreatorFilter
          value={filters.creator}
          onChange={(val) => onFilterChange({ creator: val })}
        />
        <Select
          label="Sort By"
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          options={sortFields}
          placeholder="None"
        />
        <Select
          label="Order"
          value={filters.order}
          onChange={(e) => onFilterChange({ order: e.target.value })}
          options={orderOptions}
          placeholder="Order"
        />
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={RotateCcw}
            className="w-full h-[38px] justify-center"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
