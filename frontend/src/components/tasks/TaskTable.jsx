import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, EmptyState } from '../ui';
import { getTaskTableRow } from './TaskTableRow';

export const TaskTable = ({ tasks = [], loading = false, onResetFilters, onEditTask, canEdit = true }) => {
  const navigate = useNavigate();

  const headers = [
    'Task',
    'Assignee',
    'Assigned By',
    'Priority',
    'Status',
    'Due Date',
    'Created',
    'Updated',
    ...(canEdit ? ['Actions'] : [])
  ];

  const rows = tasks.map((task) => getTaskTableRow(task, onEditTask, canEdit));

  const handleRowClick = (row, idx) => {
    const task = tasks[idx];
    if (task?.id) {
      navigate(`/tasks/${task.id}`);
    }
  };

  const emptyView = (
    <EmptyState
      iconName="Search"
      title="No tasks found"
      description="No tasks matched your current filter criteria. Try resetting them."
      actionLabel="Reset Filters"
      onActionClick={onResetFilters}
    />
  );

  return (
    <Table
      headers={headers}
      rows={rows}
      loading={loading}
      emptyState={emptyView}
      onRowClick={handleRowClick}
      striped={true}
      hover={true}
    />
  );
};

export default TaskTable;
