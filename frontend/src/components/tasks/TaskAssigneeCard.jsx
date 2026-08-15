import React from 'react';
import { Card, Avatar } from '../ui';

export const TaskAssigneeCard = ({ assignee }) => {
  return (
    <Card padding="sm" className="bg-slate-950/20 border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assignee</span>
        {assignee ? (
          <div className="flex items-center gap-2.5 pt-1">
            <Avatar size="sm" src={assignee.avatar} name={assignee.name} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-350 truncate">{assignee.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{assignee.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500 pt-1">Unassigned</p>
        )}
      </div>
    </Card>
  );
};

export default TaskAssigneeCard;
