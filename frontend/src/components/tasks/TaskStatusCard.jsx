import React from 'react';
import { Card, StatusBadge } from '../ui';

export const TaskStatusCard = ({ status }) => {
  return (
    <Card padding="sm" className="bg-slate-950/20 border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
        <div className="pt-1">
          <StatusBadge status={status} />
        </div>
      </div>
    </Card>
  );
};

export default TaskStatusCard;
