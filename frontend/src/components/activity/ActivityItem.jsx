import React from 'react';
import { PlusCircle, RefreshCw, AlertOctagon, UserPlus, Calendar, MessageSquare, HelpCircle } from 'lucide-react';
import { formatRelativeDate } from '../../utils/date';
import { cn } from '../../utils/cn';

export const ActivityItem = ({ log }) => {
  const getActionConfig = (action) => {
    switch (action) {
      case 'TASK_CREATED':
        return { icon: PlusCircle, color: 'text-green-400 bg-green-500/10 border-green-500/20', label: 'created the task' };
      case 'STATUS_CHANGED':
        return { icon: RefreshCw, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'changed status' };
      case 'PRIORITY_CHANGED':
        return { icon: AlertOctagon, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', label: 'changed priority' };
      case 'ASSIGNEE_CHANGED':
        return { icon: UserPlus, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'changed assignee' };
      case 'DUE_DATE_CHANGED':
        return { icon: Calendar, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', label: 'changed due date' };
      case 'COMMENT_ADDED':
        return { icon: MessageSquare, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'added a comment' };
      default:
        return { icon: HelpCircle, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'updated task' };
    }
  };

  const config = getActionConfig(log.action);
  const Icon = config.icon;

  const renderValues = () => {
    if (log.action === 'TASK_CREATED') {
      return <span className="font-semibold text-slate-300">"{log.newValue}"</span>;
    }
    if (log.oldValue !== null || log.newValue !== null) {
      return (
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium flex-wrap">
          {log.oldValue && (
            <>
              <span className="line-through">{log.oldValue}</span>
              <span>→</span>
            </>
          )}
          <span className="text-slate-350">{log.newValue || 'none'}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex gap-4 items-start relative pb-6 last:pb-0 animate-fade-in">
      {/* Connector line */}
      <div className="absolute top-8 left-4 bottom-0 w-0.5 bg-slate-800 -z-10 group-last:hidden" />

      {/* Icon node */}
      <div className={cn('w-8 h-8 rounded-full border flex items-center justify-center shrink-0 shadow-sm', config.color)}>
        <Icon className="w-4 h-4 shrink-0" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5 space-y-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-slate-400">
            <span className="font-bold text-slate-200">{log.user?.name || 'Actor'}</span>{' '}
            <span>{config.label}</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            {formatRelativeDate(log.createdAt)}
          </span>
        </div>
        {renderValues()}
      </div>
    </div>
  );
};

export default ActivityItem;
