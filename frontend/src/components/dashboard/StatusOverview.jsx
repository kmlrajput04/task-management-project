import React from 'react';
import { Card, StatusBadge, Skeleton } from '../ui';

export const StatusOverview = ({ distribution = [], totalTasks = 0, loading = false }) => {
  if (loading) {
    return (
      <Card title="Status Distribution" padding="md" className="h-full">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton variant="text" className="w-16 h-3" />
                <Skeleton variant="text" className="w-8 h-3" />
              </div>
              <Skeleton variant="text" className="w-full h-2" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Ensure all 4 states are represented
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'];
  const dataMap = new Map(distribution.map((item) => [item.status, item.count]));

  return (
    <Card title="Status Distribution" padding="md" className="h-full">
      <div className="space-y-5">
        {statuses.map((status) => {
          const count = dataMap.get(status) || 0;
          const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

          // Simple theme bar styling maps
          const barColorMap = {
            PENDING: 'bg-slate-700',
            IN_PROGRESS: 'bg-blue-500',
            COMPLETED: 'bg-green-500',
            BLOCKED: 'bg-red-500'
          };

          return (
            <div key={status} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="text-xs font-semibold text-slate-400">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColorMap[status]} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StatusOverview;
