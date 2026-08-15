import React from 'react';
import { Card, Skeleton } from '../ui';
import { cn } from '../../utils/cn';

export const StatsCard = ({ title, value, icon: Icon, color = 'blue', loading = false }) => {
  if (loading) {
    return (
      <Card padding="md" className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-24 h-3" />
          <Skeleton variant="text" className="w-16 h-6" />
        </div>
        <Skeleton variant="avatar" className="w-10 h-10" />
      </Card>
    );
  }

  const borderColors = {
    blue: 'border-l-4 border-l-blue-500',
    yellow: 'border-l-4 border-l-yellow-500',
    green: 'border-l-4 border-l-green-500',
    red: 'border-l-4 border-l-red-500',
    indigo: 'border-l-4 border-l-indigo-500',
    slate: 'border-l-4 border-l-slate-500'
  };

  const bgIconColors = {
    blue: 'bg-blue-500/10 text-blue-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    green: 'bg-green-500/10 text-green-400',
    red: 'bg-red-500/10 text-red-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    slate: 'bg-slate-500/10 text-slate-400'
  };

  return (
    <Card padding="md" className={cn('flex items-center justify-between transition-transform hover:-translate-y-0.5', borderColors[color])}>
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <h4 className="text-2xl font-bold text-slate-100">{value}</h4>
      </div>
      {Icon && (
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', bgIconColors[color])}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
