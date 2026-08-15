import React from 'react';
import { Card, PriorityBadge } from '../ui';

export const TaskPriorityCard = ({ priority }) => {
  return (
    <Card padding="sm" className="bg-slate-950/20 border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</span>
        <div className="pt-1">
          <PriorityBadge priority={priority} />
        </div>
      </div>
    </Card>
  );
};

export default TaskPriorityCard;
