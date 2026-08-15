import React from 'react';
import { Pagination, Select } from '../ui';

export const TaskPaginationBar = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  disabled = false
}) => {
  const limitOptions = [
    { value: '10', label: '10 per page' },
    { value: '20', label: '20 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-800/80 mt-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Total: {totalItems} tasks
        </span>
        <div className="w-32">
          <Select
            value={String(limit)}
            onChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
            options={limitOptions}
            placeholder="Limit"
            disabled={disabled}
            className="py-1 text-xs"
          />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TaskPaginationBar;
