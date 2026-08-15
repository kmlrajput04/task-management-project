import React from 'react';
import * as LucideIcons from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  iconName = 'Inbox',
  title = 'No data available',
  description = 'There is no data to show at this moment.',
  actionLabel,
  onActionClick,
  illustration: Illustration
}) => {
  const IconComponent = LucideIcons[iconName] || LucideIcons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/10 border border-slate-850 rounded-2xl max-w-md mx-auto my-8 animate-fade-in">
      {Illustration ? (
        <div className="mb-6">{Illustration}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
          <IconComponent className="w-6 h-6 animate-pulse" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">{description}</p>
      {actionLabel && onActionClick && (
        <Button variant="primary" size="sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
