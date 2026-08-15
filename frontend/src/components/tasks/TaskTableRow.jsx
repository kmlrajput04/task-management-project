import React from 'react';
import { StatusBadge, PriorityBadge, Avatar } from '../ui';
import { formatRelativeDate } from '../../utils/date';

export const getTaskTableRow = (task, onEditClick, canEdit = true) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  const cells = [
    // Column 1: Title & Description Preview
    <div className="space-y-0.5 max-w-[280px]">
      <span className="font-medium text-slate-200 line-clamp-1">{task.title}</span>
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
      )}
    </div>,

    // Column 2: Assignee Avatar & Name
    <div className="flex items-center gap-2">
      <Avatar size="xs" src={task.assignee?.avatar} name={task.assignee?.name || 'Unassigned'} />
      <span className="text-xs text-slate-300">{task.assignee?.name || 'Unassigned'}</span>
    </div>,

    // Column 3: Assigned By (Creator) Avatar & Name
    <div className="flex items-center gap-2">
      <Avatar size="xs" src={task.creator?.avatar} name={task.creator?.name || 'System'} className="no-invert" />
      <span className="text-xs text-slate-300">{task.creator?.name || 'System'}</span>
    </div>,

    // Column 3: Priority Badge
    <PriorityBadge priority={task.priority} />,

    // Column 4: Status Badge
    <StatusBadge status={task.status} />,

    // Column 5: Due Date (with overdue warning highlight)
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded ${
        isOverdue
          ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-semibold animate-pulse'
          : 'text-slate-400'
      }`}
    >
      {task.dueDate ? formatRelativeDate(task.dueDate) : 'No due date'}
    </span>,

    // Column 6: Created Date
    <span className="text-xs text-slate-500">{formatRelativeDate(task.createdAt)}</span>,

    // Column 7: Updated Date
    <span className="text-xs text-slate-500">{formatRelativeDate(task.updatedAt)}</span>
  ];

  if (canEdit) {
    cells.push(
      <span
        onClick={(e) => {
          e.stopPropagation();
          onEditClick && onEditClick(task);
        }}
        className="text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
      >
        Edit
      </span>
    );
  }

  return cells;
};

export default getTaskTableRow;
