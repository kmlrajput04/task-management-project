import React from 'react';
import { Card } from '../ui';
import { formatRelativeDate } from '../../utils/date';

export const TaskDueDateCard = ({ dueDate, status }) => {
  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'COMPLETED';

  return (
    <Card padding="sm" className="bg-slate-950/20 border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Due Date</span>
        <div className="pt-1">
          {dueDate ? (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                isOverdue
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold animate-pulse'
                  : 'text-slate-350'
              }`}
            >
              {formatRelativeDate(dueDate)}
            </span>
          ) : (
            <span className="text-xs text-slate-500">No due date</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskDueDateCard;
