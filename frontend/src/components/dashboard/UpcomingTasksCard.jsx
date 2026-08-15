import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PriorityBadge, Avatar, EmptyState, Skeleton } from '../ui';
import { formatRelativeDate } from '../../utils/date';
import { differenceInDays } from 'date-fns';

export const UpcomingTasksCard = ({ tasks = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card title="Upcoming Deadlines" padding="md">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-800/40">
              <div className="space-y-2">
                <Skeleton variant="text" className="w-48 h-4" />
                <Skeleton variant="text" className="w-24 h-3" />
              </div>
              <Skeleton variant="avatar" className="w-6 h-6" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card title="Upcoming Deadlines" padding="md">
        <EmptyState
          iconName="Calendar"
          title="No upcoming tasks"
          description="All clear! No pending upcoming deadlines found."
        />
      </Card>
    );
  }

  return (
    <Card title="Upcoming Deadlines" description="Nearest deadlines requiring attention" padding="md">
      <div className="space-y-4">
        {tasks.map((task) => {
          const daysLeft = differenceInDays(new Date(task.dueDate), new Date());
          const isUrgent = daysLeft >= 0 && daysLeft <= 3;

          return (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="flex items-center justify-between pb-3 border-b border-slate-800/40 last:border-0 last:pb-0 cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{task.title}</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      isUrgent
                        ? 'bg-red-500/10 text-red-400 border border-red-500/25 animate-pulse'
                        : 'text-slate-500'
                    }`}
                  >
                    Due {formatRelativeDate(task.dueDate)}
                  </span>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              <Avatar size="sm" src={task.assignee?.avatar} name={task.assignee?.name || 'Unassigned'} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default UpcomingTasksCard;
