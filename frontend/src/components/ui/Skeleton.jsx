import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, variant = 'text', ...props }) => {
  const baseStyles = 'bg-slate-800/80 animate-pulse rounded';

  const variants = {
    text: 'h-4 w-full',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-9 w-24 rounded-lg',
    card: 'h-32 w-full rounded-xl',
    row: 'h-12 w-full rounded-md'
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};

export default Skeleton;
