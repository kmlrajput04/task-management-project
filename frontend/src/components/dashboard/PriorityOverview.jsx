import React from 'react';
import { Card, PriorityBadge, Skeleton } from '../ui';

export const PriorityOverview = ({ distribution = [], totalTasks = 0, loading = false }) => {
  if (loading) {
    return (
      <Card title="Priority Distribution" padding="md" className="h-full">
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
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const dataMap = new Map(distribution.map((item) => [item.priority, item.count]));

  return (
    <Card title="Priority Distribution" padding="md" className="h-full">
      <div className="space-y-5">
        {priorities.map((priority) => {
          const count = dataMap.get(priority) || 0;
          const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

          const barColorMap = {
            LOW: 'bg-slate-700',
            MEDIUM: 'bg-blue-500',
            HIGH: 'bg-yellow-500',
            URGENT: 'bg-red-500'
          };

          return (
            <div key={priority} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <PriorityBadge priority={priority} />
                <span className="text-xs font-semibold text-slate-400">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${barColorMap[priority]} rounded-full transition-all duration-500`}
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

export default PriorityOverview;
