import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none border tracking-wider whitespace-nowrap';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/80',
    secondary: 'bg-slate-700/50 text-slate-400 border-slate-700/30',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
