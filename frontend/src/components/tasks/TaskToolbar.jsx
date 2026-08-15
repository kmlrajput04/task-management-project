import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { SearchInput, Button } from '../ui';

export const TaskToolbar = ({ searchValue = '', onSearchChange, onRefresh, isRefreshing = false, onCreateClick, showCreate = true }) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);

  // Sync state if filters reset/updated externally
  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  // Debounced input search parameter trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== searchValue) {
        onSearchChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearchChange, searchValue]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClear={() => setSearchTerm('')}
        placeholder="Search tasks by title, description..."
        className="max-w-md w-full"
      />

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          loading={isRefreshing}
          leftIcon={RefreshCw}
        >
          Refresh
        </Button>
        {showCreate && (
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={onCreateClick}
          >
            Create Task
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskToolbar;
