import React from 'react';
import { cn } from '../../utils/cn';

export const Spinner = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-slate-500/20 border-t-current',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export default Spinner;
