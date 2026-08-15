import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, StatusBadge, PriorityBadge, Avatar, Card } from '../ui';
import { formatRelativeDate } from '../../utils/date';

export const RecentTasksTable = ({ tasks = [], loading = false }) => {
  const navigate = useNavigate();

  const headers = ['Task', 'Status', 'Priority', 'Assignee', 'Updated'];

  const rows = tasks.map((task) => [
    <span className="font-medium text-slate-200">{task.title}</span>,
    <StatusBadge status={task.status} />,
    <PriorityBadge priority={task.priority} />,
    <div className="flex items-center gap-2">
      <Avatar size="xs" src={task.assignee?.avatar} name={task.assignee?.name || 'Unassigned'} />
      <span className="text-xs">{task.assignee?.name || 'Unassigned'}</span>
    </div>,
    <span className="text-xs text-slate-500">{formatRelativeDate(task.updatedAt)}</span>
  ]);

  const handleRowClick = (row, idx) => {
    const task = tasks[idx];
    if (task?.id) {
      navigate(`/tasks/${task.id}`);
    }
  };

  return (
    <Card title="Recent Activity" description="Latest updates across all project tasks" padding="none">
      <Table
        headers={headers}
        rows={rows}
        loading={loading}
        onRowClick={handleRowClick}
        hover={true}
        className="border-none rounded-none shadow-none"
      />
    </Card>
  );
};

export default RecentTasksTable;
