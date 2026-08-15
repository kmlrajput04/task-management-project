import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, StatusBadge, PriorityBadge, EmptyState, Skeleton } from '../ui';
import { formatRelativeDate } from '../../utils/date';

export const MyTasksCard = ({ tasks = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card title="Assigned to Me" padding="md">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pb-3 border-b border-slate-800/40 space-y-2">
              <Skeleton variant="text" className="w-48 h-4" />
              <div className="flex gap-2">
                <Skeleton variant="text" className="w-16 h-3" />
                <Skeleton variant="text" className="w-16 h-3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card title="Assigned to Me" padding="md">
        <EmptyState
          iconName="UserCheck"
          title="No tasks assigned"
          description="You are all caught up! No tasks currently assigned to you."
        />
      </Card>
    );
  }

  return (
    <Card title="Assigned to Me" description="Task load assigned to your profile" padding="md">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="pb-3 border-b border-slate-800/40 last:border-0 last:pb-0 cursor-pointer hover:opacity-85 transition-opacity space-y-1.5"
          >
            <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{task.title}</h4>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              {task.dueDate && (
                <span className="text-[11px] text-slate-500 font-medium">
                  Due {formatRelativeDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MyTasksCard;
