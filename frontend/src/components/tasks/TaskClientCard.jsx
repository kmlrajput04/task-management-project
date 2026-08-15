import React from 'react';
import { Card } from '../ui';
import { Globe } from 'lucide-react';

export const TaskClientCard = ({ client }) => {
  return (
    <Card padding="sm" className="bg-slate-950/20 border-slate-800/80">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Linked Client</span>
        <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">{client || 'No external client'}</span>
        </div>
      </div>
    </Card>
  );
};

export default TaskClientCard;
